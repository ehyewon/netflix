import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  apiKey = 'b4303f4fca2d461848894c447fbf6a72';
  popularMovies: any[] = [];
  featuredMovie: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPopularMovies();
  }

  // 인기 영화 가져오기
  fetchPopularMovies() {
    const url =
      `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=ko-KR`;

    this.http.get(url).subscribe((data: any) => {
      this.popularMovies = data.results;
      this.featuredMovie = data.results[0]; // 첫 번째 영화 대표로 선택
      console.log("불러온 인기 영화:", this.popularMovies);
    });
  }

  // 이미지 URL 보조 함수
  getPoster(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
