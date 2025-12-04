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

  private handleError(error: any, context: string) {
    console.error(`🔥 TMDB API ERROR in ${context}`);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("❌ 요청은 갔지만 응답이 없음");
    } else {
      console.error("❌ 요청 설정 오류:", error.message);
    }
    return null;
  }

  //-------------------------------------------
  // 1) 배너 (인기 영화 중 첫 번째)
  //-------------------------------------------
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

  //-------------------------------------------
  // 2) 인기 영화 조회
  //-------------------------------------------
  async getPopularMovies(page: number = 1) {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
        this.authHeader
      );
      return res.data.results;
    } catch (err) {
      return this.handleError(err, "getPopularMovies()");
    }
  }

  getPopularMoviesURL(page: number = 1): string {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=ko-KR&page=${page}`;
  }

  //-------------------------------------------
  // 3) 상세 조회
  //-------------------------------------------
  async getMovieDetail(movieId: number) {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
        this.authHeader
      );
      return res.data;
    } catch (err) {
      return this.handleError(err, "getMovieDetail()");
    }
  }

  //-------------------------------------------
  // 4) 검색
  //-------------------------------------------
  async searchMovies(query: string, page: number = 1) {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR&page=${page}`,
        this.authHeader
      );
      return res.data.results;
    } catch (err) {
      return this.handleError(err, "searchMovies()");
    }
  }

  //-------------------------------------------
  // ⭐⭐ 5) 장르 목록 추가 ⭐⭐
  //-------------------------------------------
  async getGenreList() {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?language=ko-KR`,
        this.authHeader
      );
      return res.data.genres;
    } catch (err) {
      return this.handleError(err, "getGenreList()");
    }
  }

  //-------------------------------------------
  // ⭐⭐ 6) 장르별 영화 조회 ⭐⭐
  //-------------------------------------------
  async getMoviesByGenre(genreId: number, page: number = 1) {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=ko-KR&page=${page}`,
        this.authHeader
      );
      return res.data.results;
    } catch (err) {
      return this.handleError(err, "getMoviesByGenre()");
    }
  }

  getMoviesByGenreURL(genreId: number, page: number = 1): string {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&language=ko-KR&page=${page}`;
  }
}
