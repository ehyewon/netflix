<template>
  <div class="popular-page">

    <!-- 제목 -->
    <h1>인기 영화</h1>

    <!-- 보기 전환 -->
    <div class="view-toggle">
      <button
        :class="{ active: viewMode === 'grid' }"
        @click="setView('grid')"
      >■</button>

      <button
        :class="{ active: viewMode === 'scroll' }"
        @click="setView('scroll')"
      >☰</button>
    </div>

    <!-- ================= GRID MODE ================= -->
    <div v-if="viewMode === 'grid'" class="grid-container">
      <div class="grid">
        <MovieCard
          v-for="movie in pagedMovies"
          :key="movie.id"
          :movie="movie"
          mode="wishlist"
        />
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">이전</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">다음</button>
      </div>
    </div>

    <!-- ================= SCROLL MODE ================= -->
    <div
      v-if="viewMode === 'scroll'"
      class="scroll-container"
      ref="scrollBox"
    >
      <MovieCard
        v-for="movie in scrollMovies"
        :key="movie.id"
        :movie="movie"
        mode="wishlist"
      />

      <!-- 🔄 스크롤 로딩 -->
      <div v-if="scrollLoading" class="scroll-loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <button
        v-if="showTop"
        class="top-btn"
        @click="goTop"
      >
        TOP
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from "vue";
import MovieCard from "@/components/MovieCard.vue";
import { getPopular } from "@/api/movieApi";

/* ===== VIEW MODE ===== */
const viewMode = ref("grid");
const setView = (mode) => (viewMode.value = mode);

/* ===== RESPONSIVE ===== */
const isMobile = ref(window.innerWidth <= 768);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

window.addEventListener("resize", handleResize);

/* ===== GRID MODE ===== */
const movies = ref([]);
const page = ref(1);
const totalPages = ref(10);

const ITEMS_PER_PAGE = computed(() => (isMobile.value ? 4 : 16));

const pagedMovies = computed(() => {
  return movies.value.slice(0, ITEMS_PER_PAGE.value);
});

async function loadGridMovies() {
  movies.value = await getPopular(page.value);
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++;
    loadGridMovies();
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
    loadGridMovies();
  }
}

/* ===== SCROLL MODE ===== */
const scrollMovies = ref([]);
const scrollPage = ref(1);
const scrollBox = ref(null);
const showTop = ref(false);
const scrollLoading = ref(false); // 🔥 추가

async function loadScrollMovies() {
  if (scrollLoading.value) return;

  scrollLoading.value = true;
  const data = await getPopular(scrollPage.value);
  scrollMovies.value.push(...data);
  scrollLoading.value = false;
}

function handleScroll() {
  const el = scrollBox.value;
  if (!el) return;

  showTop.value = el.scrollTop > 300;

  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
    scrollPage.value++;
    loadScrollMovies();
  }
}

function goTop() {
  scrollBox.value.scrollTo({ top: 0, behavior: "smooth" });
}

watch(viewMode, async (mode, prev) => {
  if (prev === "scroll") {
    scrollBox.value?.removeEventListener("scroll", handleScroll);
  }

  if (mode === "scroll") {
    await nextTick();
    scrollBox.value.addEventListener("scroll", handleScroll);

    if (scrollMovies.value.length === 0) {
      loadScrollMovies();
    }
  }
});

onMounted(loadGridMovies);

onBeforeUnmount(() => {
  scrollBox.value?.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* ===== PAGE ===== */
.popular-page {
  padding-top: 20px;
  color: white;
}

/* ===== VIEW TOGGLE ===== */
.view-toggle {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 0 20px 15px;
}

.view-toggle button {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  border: none;
  background: #333;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

.view-toggle .active {
  background: #e50914;
}

/* ===== GRID ===== */
.grid {
  display: grid;
  gap: 28px;
  padding: 0 24px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

/* ===== PAGINATION ===== */
.pagination {
  margin-top: 28px;
  margin-bottom: 32px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.pagination button {
  padding: 10px 22px;
  font-size: 15px;
  border-radius: 8px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ================= SCROLL MODE ================= */
.scroll-container {
  height: 80vh;
  overflow-y: auto;
  padding: 0 24px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 28px;
}

/* 🔄 SCROLL LOADING */
.scroll-loading {
  grid-column: 1 / -1;
  text-align: center;
  margin: 30px 0;
  color: #aaa;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .grid,
  .scroll-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 0 12px;
  }
}

/* ===== TOP BUTTON ===== */
.top-btn {
  position: fixed;
  right: 16px;
  bottom: 24px;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background: #e50914;
  color: white;
  cursor: pointer;
}
</style>
