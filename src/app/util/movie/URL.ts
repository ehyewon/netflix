import axios from "axios";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class URLService {

  private apiKey = environment.TMDB_KEY;
  private v4Token = environment.TMDB_V4_TOKEN;

  private authHeader = {
    headers: {
      Authorization: `Bearer ${this.v4Token}`,
      "Content-Type": "application/json;charset=utf-8"
    }
  };

  // 🔥 공통 에러 핸들러
  private handleError(error: any, context: string) {
    console.error(`🔥 TMDB API ERROR in ${context}`);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);

      switch (error.response.status) {
        case 401:
          console.error("❌ 인증 실패: API Key 또는 토큰이 잘못됨.");
          break;
        case 404:
          console.error("❌ 리소스를 찾을 수 없음 (URL 또는 파라미터 오류).");
          break;
        case 429:
          console.error("❌ 요청 제한 초과: 너무 많이 요청함.");
          break;
        case 500:
          console.error("❌ TMDB 서버 내부 문제.");
          break;
      }
    } else if (error.request) {
      console.error("❌ 요청은 갔지만 응답 없음 (네트워크 문제).");
    } else {
      console.error("❌ 요청 설정 중 오류:", error.message);
    }

    return null;
  }

  // 🔹 배너 영화 가져오기
  async fetchFeaturedMovie() {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR`,
        this.authHeader
      );
      return res.data.results[0];
    } catch (err) {
      return this.handleError(err, "fetchFeaturedMovie()");
    }
  }

  // 🔹 인기 영화 URL
  getURL4PopularMovies(page: number = 1) {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=ko-KR&page=${page}`;
  }

  // 🔹 최신 영화 URL
  getURL4ReleaseMovies(page: number = 1) {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}&language=ko-KR&page=${page}`;
  }

  // 🔹 장르 영화 URL
  getURL4GenreMovies(genre: string, page: number = 1) {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  }
}
