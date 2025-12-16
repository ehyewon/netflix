<template>
  <div class="world" @click.self="close">
    <section class="cinema" :class="{ active: entered }">

      <!-- LEFT : 포스터 -->
      <div class="visual">
        <img :src="posterUrl" class="poster" />
        <div class="temperature">{{ temperature }}</div>
      </div>

      <!-- RIGHT : 정보 -->
      <div class="info">
        <p class="tagline">{{ movie.tagline || "이 영화는 이런 분위기의 작품입니다." }}</p>

        <h1 class="title">{{ movie.title }}</h1>

        <!-- 메타 정보 -->
        <div class="meta">
          <span>{{ year }}</span>
          <span>{{ runtime }}분</span>
          <span>⭐ {{ movie.vote_average }}</span>
        </div>

        <!-- 장르 -->
        <div class="genres">
          <span v-for="g in genres" :key="g" class="genre">
            {{ g }}
          </span>
        </div>

        <p class="overview">{{ movie.overview }}</p>

        <!-- 버튼 -->
        <div class="actions">
          <button class="primary">▶ 재생</button>
          <button class="ghost" @click="close">현실로 돌아가기</button>
        </div>

        <!-- 관련 영화 -->
        <div v-if="similar.length" class="related">
          <h3>🎞 비슷한 분위기의 영화</h3>

          <div class="related-row">
            <div
              v-for="m in similar"
              :key="m.id"
              class="related-card"
              @click="selectSimilar(m)"
            >
              <img
                :src="`https://image.tmdb.org/t/p/w300${m.poster_path}`"
              />
              <p>{{ m.title }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  movie: Object,
});
const emit = defineEmits(["close"]);

const entered = ref(false);
const detail = ref(null);
const similar = ref([]);

/* =====================
   계산 값
===================== */
const posterUrl = computed(() =>
  `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
);

const temperature = computed(() =>
  `${Math.round((props.movie.vote_average || 0) * 4)}°C`
);

const year = computed(() =>
  props.movie.release_date?.slice(0, 4)
);

const runtime = computed(() => detail.value?.runtime || "-");

const genres = computed(() =>
  detail.value?.genres?.map(g => g.name) || []
);

/* =====================
   API
===================== */
async function loadDetail() {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${props.movie.id}`,
    {
      params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: "ko-KR" },
    }
  );
  detail.value = res.data;
}

async function loadSimilar() {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${props.movie.id}/similar`,
    {
      params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: "ko-KR" },
    }
  );
  similar.value = res.data.results.slice(0, 10);
}

/* =====================
   라이프사이클
===================== */
onMounted(async () => {
  await loadDetail();
  await loadSimilar();
  setTimeout(() => (entered.value = true), 100);
});

/* =====================
   액션
===================== */
function close() {
  entered.value = false;
  setTimeout(() => emit("close"), 300);
}

function selectSimilar(movie) {
  emit("close");
  setTimeout(() => {
    // Home.vue의 openDetail이 다시 실행됨
    document.body.dispatchEvent(
      new CustomEvent("open-movie", { detail: movie })
    );
  }, 300);
}
</script>
