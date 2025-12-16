<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">

      <!-- 헤더 -->
      <div class="header" :style="headerStyle">
        <div class="overlay"></div>
        <button class="close-icon" @click="close">✕</button>

        <div class="header-text">
          <h1 class="title">{{ movie.title }}</h1>

          <!-- ⭐ 메타 정보 -->
          <div class="meta">
            <span class="rating">
              ⭐ {{ movie.vote_average?.toFixed(1) ?? "-" }}
            </span>
            <span class="dot">•</span>
            <span>{{ runtimeText }}</span>
            <span class="dot">•</span>
            <span>{{ movie.release_date || "-" }}</span>
          </div>

          <!-- 🎬 장르 -->
          <div class="genres" v-if="genres.length">
            <span v-for="g in genres" :key="g.id">
              {{ g.name }}
            </span>
          </div>
        </div>
      </div>

            <!-- 🎬 예고편 (줄거리 위) -->
      <div class="trailer-top" v-if="trailerKey">
        <iframe
          :src="`https://www.youtube.com/embed/${trailerKey}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>


      <!-- 본문 -->
      <div class="content">
        <p class="overview">
          {{ movie.overview || "줄거리 정보가 없습니다." }}
        </p>
      </div>

            <!-- 🎬 비슷한 영화 -->
      <div class="similar" v-if="similar.length">
        <h3 class="similar-title">비슷한 영화</h3>

        <div class="similar-list">
          <div
            v-for="item in similar"
            :key="item.id"
            class="similar-card"
            @click="selectMovie(item)"
          >
            <img
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w300${item.poster_path}`"
              :alt="item.title"
            />
            <p class="similar-name">{{ item.title }}</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  movie: { type: Object, required: true },
  detail: { type: Object, default: null }, // getMovieDetail 결과
  similar: {type: Array,default: () => [],},
  trailerKey: { type: String, default: null }, // ⭐ 추가
});

const emits = defineEmits(["close", "select"]);
const close = () => emits("close");

function selectMovie(movie) {
  emits("select", movie);
}

/* ✅ 러닝타임 (핵심) */
const runtimeText = computed(() => {
  const r = props.detail?.runtime;
  if (!r) return "러닝타임 정보 없음";

  const h = Math.floor(r / 60);
  const m = r % 60;

  return h ? `${h}시간 ${m}분` : `${m}분`;
});

/* ✅ 장르 */
const genres = computed(() => props.detail?.genres || []);

/* ✅ 헤더 배경 스타일 */
const headerStyle = computed(() => {
  return props.movie.backdrop_path
    ? {
        backgroundImage: `url(https://image.tmdb.org/t/p/original${props.movie.backdrop_path})`,
      }
    : {
        backgroundColor: "#111",
      };
});
</script>

<style scoped>
/* 배경 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.78);
  backdrop-filter: blur(8px);

  display: flex;
  justify-content: center;
  align-items: flex-start;   /* ⭐ 여기 */

  padding-top: 40px;         /* ⭐ 여기 */
  padding-bottom: 40px;

  z-index: 2000;
}


/* 모달 */
.modal {
  width: 92%;
  max-width: 760px;

  max-height: calc(100vh - 80px); /* ⭐ padding 고려 */
  overflow-y: auto;

  background: #0f0f0f;
  border-radius: 18px;

  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
  
}

/* 상세페이지 스크롤바 */
.modal::-webkit-scrollbar {
  width: 6px;               /* 얇게 */
}

.modal::-webkit-scrollbar-track {
  background: transparent;  /* 배경 숨김 */
}

.modal::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
}

.modal::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.45);
}


/* 헤더 */
.header {
  position: relative;
  height: 360px;
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.25),
    rgba(15,15,15,0.95)
  );
}

/* 닫기 버튼 */
.close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

/* 텍스트 */
.header-text {
  position: absolute;
  left: 26px;
  bottom: 22px;
  right: 26px;
}

.title {
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: .9;
  margin-bottom: 10px;
}

.dot {
  opacity: .6;
}

/* 장르 */
.genres span {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  font-size: 0.75rem;
}

/* 본문 */
.content {
  padding: 26px 28px 34px;
}

.overview {
  font-size: 0.96rem;
  line-height: 1.75;
  color: #d6d6d6;
}

/* 애니메이션 */
@keyframes modalIn {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* 비슷한 영화 */
.similar {
  margin-top: 32px;
}

.similar-title {
  font-size: 1.1rem;
  margin-bottom: 12px;
  margin-left: 10px;
}

.similar-list {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.similar-list::-webkit-scrollbar {
  display: none;
}

.similar-card {
  width: 120px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.similar-card:hover {
  transform: scale(1.08);
}

.similar-card img {
  width: 100%;
  border-radius: 8px;
}

.similar-name {
  margin-top: 6px;
  font-size: 0.8rem;
  text-align: center;
  color: #ddd;
}

/* 🎬 줄거리 위 예고편 */
.trailer {
  padding: 0 28px 24px;
}

.trailer-title {
  font-size: 1.1rem;
  margin-bottom: 12px;
}

/* 비율 유지용 wrapper */
.trailer-wrapper {
  position: relative;
  width: 100%;
  padding-top: 50%;        /* PC에서 살짝 컴팩트 */
  max-width: 720px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.trailer-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* 모바일 */
@media (max-width: 480px) {
  .header {
    height: 240px;
  }

  .title {
    font-size: 1.4rem;
  }

  .trailer {
    padding: 0 16px 20px;
  }

  .trailer-wrapper {
    padding-top: 56.25%; /* 모바일은 16:9 */
  }
}


</style>

