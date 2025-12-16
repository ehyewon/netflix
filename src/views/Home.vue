<script setup>
import { ref, onMounted, provide, watch } from "vue";
import FeaturedMovie from "@/components/FeaturedMovie.vue";
import MovieList from "@/components/MovieList.vue";
import MovieDetail from "@/components/MovieDetail.vue";

import {
  getPopular,
  getAction,
  getTopRated,
  getMovieDetail,
  getSimilarMovies,   // ✅ 추가
  getMovieVideos,
} from "@/api/movieApi";

// 상태
const featured = ref(null);
const popular = ref([]);
const action = ref([]);
const topRated = ref([]);
const similarMovies = ref([]);
const trailerKey = ref(null);
const selectedMovie = ref(null);
const movieDetail = ref(null); // ✅ 상세 정보 상태

// 🔥 상세 모달 열기 (수정 핵심)
async function openDetail(movie) {
  selectedMovie.value = movie;

  // ✅ 상세 API 호출 (러닝타임 여기서 옴)
  movieDetail.value = await getMovieDetail(movie.id);
  similarMovies.value = await getSimilarMovies(movie.id);
    // 🎬 예고편
  const videos = await getMovieVideos(movie.id);
  const trailer = videos.find(
    v => v.type === "Trailer" && v.site === "YouTube"
  );

  trailerKey.value = trailer ? trailer.key : null;


  console.log("runtime:", movieDetail.value.runtime); // 108 찍혀야 정상
}
provide("openDetail", openDetail);

// API 호출
onMounted(async () => {
  popular.value = await getPopular();
  action.value = await getAction();
  topRated.value = await getTopRated();

  featured.value = popular.value[0];
});

watch(selectedMovie, (val) => {
  if (val) {
    // 상세페이지 열림 → 홈 스크롤 잠금
    document.body.style.overflow = "hidden";
  } else {
    // 상세페이지 닫힘 → 홈 스크롤 복구
    document.body.style.overflow = "";
  }
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

    <!-- 🔥 상세 모달 -->
    <MovieDetail
      v-if="selectedMovie && movieDetail"
      :movie="selectedMovie"
      :detail="movieDetail"
      :similar="similarMovies"
      :trailer-key="trailerKey"
      @close="selectedMovie = null"
      @select="openDetail"
    />
  </div>
</template>

<style scoped>
.home {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

.modal {
  width: 92%;
  max-width: 760px;

  /* ⭐ 핵심 2줄 */
  max-height: 90vh;
  overflow-y: auto;

  background: #0f0f0f;
  border-radius: 18px;
  color: #fff;
}

@media (max-width: 480px) {
  .modal {
    max-height: 92vh;
  }
}

</style>
