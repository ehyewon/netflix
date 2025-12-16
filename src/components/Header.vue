<template>
  <header class="header">
    <!-- 왼쪽: 로고 + PC 메뉴 -->
    <div class="left-group">
      <div class="logo" @click="goHome">🍿 Netflix Clone</div>

      <!-- PC 네비 -->
      <nav class="nav pc-nav">
        <RouterLink to="/">홈</RouterLink>
        <RouterLink to="/popular">인기</RouterLink>
        <RouterLink to="/search">검색</RouterLink>

        <!-- 🔥 로그인 상태에서만 찜목록 표시 -->
        <RouterLink v-if="auth.isLogin" to="/wishlist">
          찜목록
        </RouterLink>
      </nav>
    </div>

    <!-- 오른쪽 -->
    <div class="right-group">
      <!-- 로그인 상태 -->
      <div v-if="auth.isLogin" class="user-box pc-only">
        <span class="welcome">{{ auth.email }}님</span>
        <button class="logout" @click="logoutHandler">로그아웃</button>
      </div>

      <!-- 로그아웃 상태 -->
      <div v-else class="login-btn pc-only" @click="goSignIn">
        👤
      </div>

      <!-- 🍔 햄버거 버튼 (모바일) -->
      <button class="hamburger" @click="toggleMenu">
        ☰
      </button>
    </div>
  </header>

  <!-- 📱 모바일 메뉴 -->
  <div v-if="menuOpen" class="mobile-menu">
    <RouterLink @click="closeMenu" to="/">홈</RouterLink>
    <RouterLink @click="closeMenu" to="/popular">인기</RouterLink>
    <RouterLink @click="closeMenu" to="/search">검색</RouterLink>

    <!-- 🔥 로그인 상태에서만 찜목록 표시 -->
    <RouterLink
      v-if="auth.isLogin"
      @click="closeMenu"
      to="/wishlist"
    >
      찜목록
    </RouterLink>

    <hr />

    <div v-if="auth.isLogin" class="mobile-user">
      <p>{{ auth.email }}</p>
      <button @click="logoutHandler">로그아웃</button>
    </div>

    <button v-else class="mobile-login" @click="goSignIn">
      로그인
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";

const router = useRouter();
const { auth, logout } = useAuth();

const menuOpen = ref(false);

// 이동
function goHome() {
  router.push("/");
  menuOpen.value = false;
}

function goSignIn() {
  router.push("/signin");
  menuOpen.value = false;
}

function logoutHandler() {
  logout();
  menuOpen.value = false;
  router.push("/signin");
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}
</script>

<style scoped>
/* =========================
   헤더 기본
========================= */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(8px);
  z-index: 999;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  color: white;
}

/* =========================
   PC 네비
========================= */
.pc-nav {
  display: flex;
  gap: 24px;
}

a {
  color: #eee;
  text-decoration: none;
  font-size: 16px;
}

a.router-link-active {
  font-weight: bold;
  color: white;
}

/* =========================
   오른쪽 영역
========================= */
.right-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome {
  font-size: 14px;
  color: #ddd;
}

.logout {
  padding: 6px 12px;
  background: #e50914;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.login-btn {
  font-size: 24px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
}

/* =========================
   🍔 햄버거 버튼
========================= */
.hamburger {
  display: none;
  font-size: 26px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* =========================
   📱 모바일 메뉴
========================= */
.mobile-menu {
  position: fixed;
  top: 70px;
  right: 0;
  width: 220px;
  height: calc(100vh - 70px);

  background: #141414;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;

  z-index: 998;
}

.mobile-menu a {
  font-size: 18px;
}

.mobile-user {
  margin-top: auto;
}

.mobile-user p {
  font-size: 14px;
  margin-bottom: 10px;
}

.mobile-user button,
.mobile-login {
  width: 100%;
  padding: 10px;
  background: #e50914;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

/* =========================
   📱 반응형
========================= */
@media (max-width: 768px) {
  .pc-nav,
  .pc-only {
    display: none;
  }

  .hamburger {
    display: block;
  }
}
</style>
