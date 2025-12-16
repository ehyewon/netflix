<script setup>
import { ref, onMounted, provide, watch } from "vue";
import FeaturedMovie from "@/components/FeaturedMovie.vue";
import MovieList from "@/components/MovieList.vue";
import MovieDetail from "@/components/MovieDetail.vue";

import { getPopular, getAction, getTopRated } from "@/api/movieApi";

// 상태
const featured = ref(null);
const popular = ref([]);
const action = ref([]);
const topRated = ref([]);

const selectedMovie = ref(null);

/* =========================
   🔥 상세페이지 열기 (연출 진입)
========================= */
function openDetail(movie) {
  selectedMovie.value = movie;
}
provide("openDetail", openDetail);

/* =========================
   🔥 상세 열릴 때 스크롤 잠금
========================= */
watch(selectedMovie, (val) => {
  if (val) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

// API 호출
onMounted(async () => {
  popular.value = await getPopular();
  action.value = await getAction();
  topRated.value = await getTopRated();

  featured.value = popular.value[0];
});
</script>

<template>
  <div class="home">
    <!-- 메인 배너 -->
    <FeaturedMovie v-if="featured" :movie="featured" />

    <!-- 영화 리스트 -->
    <MovieList title="🔥 인기 영화" :movies="popular" />
    <MovieList title="⭐ 평점 높은 영화" :movies="topRated" />
    <MovieList title="💥 액션 영화" :movies="action" />

    <!-- 🔥 상세 페이지 (연출형) -->
    <MovieDetail
      v-if="selectedMovie"
      :key="selectedMovie.id"  
      :movie="selectedMovie"
      @close="selectedMovie = null"
    />
  </div>
</template>

<style scoped>
/* =========================
   기본 (PC)
========================= */
.home {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* =========================
   태블릿
========================= */
@media (max-width: 1024px) {
  .home {
    padding-bottom: 40px;
  }
}

/* =========================
   모바일
========================= */
@media (max-width: 768px) {
  .home {
    padding-bottom: 24px;
  }
}

/* =========================
   소형 모바일
========================= */
@media (max-width: 480px) {
  .home {
    padding-bottom: 16px;
  }
}
</style>
