<template>
  <!-- 전체 공간 오버레이 -->
  <div
    class="world"
    :style="{ background: backgroundStyle }"
    @click.self="close"
  >
    <!-- 영화 카드 -->
    <section
      class="cinema"
      :class="{ active: entered }"
    >
      <!-- 상단 비주얼 -->
      <div class="visual">
        <img
          :src="posterUrl"
          alt="poster"
          class="poster"
        />

        <!-- 영화의 온도 -->
        <div class="temperature">
          {{ temperature }}
        </div>
      </div>

      <!-- 정보 영역 -->
      <div class="info">
        <p class="tagline">
          {{ movie.tagline || "이 영화는 이런 분위기의 작품입니다." }}
        </p>

        <h1 class="title">{{ movie.title }}</h1>

        <p class="meta">
          {{ movie.release_date }} · ⭐ {{ movie.vote_average }}
        </p>

        <p class="overview">
          {{ movie.overview }}
        </p>

        <div class="actions">
          <button class="primary">▶ 재생</button>
          <button class="ghost" @click="close">현실로 돌아가기</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

/* ===============================
   Props
================================ */
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

/* ===============================
   상태
================================ */
const entered = ref(false);

/* ===============================
   계산된 값
================================ */
const posterUrl = computed(() =>
  `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
);

// ⭐ 영화의 온도 (평점 → 감각화)
const temperature = computed(() => {
  const score = props.movie.vote_average || 0;
  return `${Math.round(score * 4)}°C`;
});

// ⭐ 전체 배경 무드
const backgroundStyle = computed(() => {
  return `
    radial-gradient(
      circle at top,
      rgba(255,255,255,0.08),
      rgba(0,0,0,0.95)
    )
  `;
});

/* ===============================
   라이프사이클
================================ */
onMounted(() => {
  setTimeout(() => {
    entered.value = true;
  }, 100);
});

/* ===============================
   닫기
================================ */
function close() {
  entered.value = false;
  setTimeout(() => emit("close"), 300);
}
</script>

<style scoped>
/* ===============================
   WORLD (영화 세계)
================================ */
.world {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.4s ease;
}

/* ===============================
   CINEMA CARD
================================ */
.cinema {
  width: min(1000px, 92%);
  height: 560px;
  background: #0f0f0f;
  border-radius: 20px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.9);

  transform: scale(0.9) translateY(40px);
  opacity: 0;
  transition: all 0.4s ease;
}

.cinema.active {
  transform: scale(1) translateY(0);
  opacity: 1;
}

/* ===============================
   VISUAL
================================ */
.visual {
  position: relative;
  width: 40%;
  background: black;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 영화 온도 */
.temperature {
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 32px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 16px;
  border-radius: 12px;
}

/* ===============================
   INFO
================================ */
.info {
  width: 60%;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.tagline {
  font-size: 14px;
  opacity: 0.6;
  margin-bottom: 10px;
}

.title {
  font-size: 36px;
  margin-bottom: 8px;
}

.meta {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 20px;
}

.overview {
  font-size: 15px;
  line-height: 1.7;
  opacity: 0.9;
  flex: 1;
}

/* ===============================
   ACTIONS
================================ */
.actions {
  display: flex;
  gap: 14px;
  margin-top: 30px;
}

.primary {
  background: #e50914;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 15px;
  color: white;
  cursor: pointer;
}

.ghost {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 15px;
  color: white;
  cursor: pointer;
}

.primary:hover,
.ghost:hover {
  transform: translateY(-2px);
}

/* ===============================
   ANIMATION
================================ */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ===============================
   MOBILE
================================ */
@media (max-width: 768px) {
  .cinema {
    flex-direction: column;
    height: 90%;
  }

  .visual,
  .info {
    width: 100%;
  }

  .visual {
    height: 40%;
  }

  .info {
    padding: 24px;
  }

  .title {
    font-size: 26px;
  }
}
</style>
