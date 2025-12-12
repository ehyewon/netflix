# 🎬 MovieFlix (Movie Web SPA)

TMDB API를 활용한 영화 정보 기반 Single Page Application(SPA) 웹 애플리케이션입니다.  
Vue 3와 Vite를 사용하여 구현하였으며, 인기 영화 조회, 카테고리별 영화 탐색,  
영화 상세 정보 확인, 찜(즐겨찾기) 기능을 제공합니다.

---

## 1. 프로젝트 기본 정보

- 프로젝트명: MovieFlix
- 개발 형태: Single Page Application (SPA)
- 주요 기능
  - 인기 영화 / 추천 영화 조회
  - 카테고리별 영화 목록
  - 영화 검색
  - 영화 상세 정보 조회
  - 찜(즐겨찾기) 기능
  - 사용자 로그인 / 로그아웃
  - 반응형 웹 UI

---

## 2. 기술 스택

### Front-End
- Vue 3 (Composition API)
- Vite
- Vue Router

### 상태 관리
- Pinia

### API
- TMDB (The Movie Database API)

### 기타
- Axios
- LocalStorage

### Deployment
- GitHub Pages
- GitHub Actions (CI/CD 자동 배포)

---

## 3. 설치 및 실행 가이드

### 3-1. 저장소 클론

~~~
git clone https://github.com/깃허브아이디/레포지토리명.git
cd 레포지토리명
~~~

---

### 3-2. 패키지 설치

~~~
npm install
~~~

---

### 3-3. 환경 변수 설정

TMDB API Key를 발급받아 프로젝트 루트에 `.env` 파일을 생성합니다.

~~~
VITE_TMDB_API_KEY=YOUR_API_KEY
~~~

---

### 3-4. 개발 서버 실행

~~~
npm run dev
~~~

브라우저에서 다음 주소로 접속합니다.  
👉 http://localhost:5173

---

## 4. 프로젝트 폴더 구조

~~~
src/
 ├─ api/
 │   └─ movieApi.js        # TMDB API 요청 로직
 ├─ assets/                # 이미지 및 전역 리소스
 ├─ components/            # 공통 컴포넌트
 │   ├─ FeaturedMovie.vue
 │   ├─ Header.vue
 │   ├─ MovieCard.vue
 │   ├─ MovieCategory.vue
 │   ├─ MovieDetail.vue
 │   ├─ MovieList.vue
 │   └─ Toast.vue
 ├─ composables/           # 커스텀 훅
 │   ├─ useAuth.js
 │   ├─ useToast.js
 │   └─ useWishlist.js
 ├─ router/
 │   └─ index.js           # 라우터 설정
 ├─ store/                 # Pinia 스토어
 ├─ views/                 # 페이지 컴포넌트
 │   ├─ Home.vue
 │   ├─ Popular.vue
 │   ├─ Search.vue
 │   ├─ Signin.vue
 │   └─ Wishlist.vue
 ├─ App.vue
 └─ main.js
~~~

---

## 5. 배포

본 프로젝트는 GitHub Actions를 이용한 자동 배포를 적용하였습니다.

- main 브랜치에 push 시 자동으로 빌드 및 배포가 수행됩니다.
- 빌드 결과물(dist)은 gh-pages 브랜치를 통해 GitHub Pages에 배포됩니다.

🔗 배포 주소  
https://깃허브아이디.github.io/레포지토리명/

---

## 6. 배포 자동화 흐름 (CI/CD)

1. main 브랜치에 코드 push
2. GitHub Actions 실행
3. 의존성 설치
4. 프로젝트 빌드
5. GitHub Pages 자동 배포

---

## 7. 체크리스트

- [x] Vue 3 기반 SPA
- [x] TMDB API 연동
- [x] Pinia 상태 관리
- [x] LocalStorage 활용
- [x] 반응형 UI
- [x] GitHub Actions 자동 배포
