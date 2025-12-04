import { Component, OnInit, OnDestroy } from '@angular/core';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { URLService } from '../../../util/movie/URL';
import { BannerComponent } from '../../../views/home-main/banner.component';
import { MovieRowComponent } from '../../../views/home-main/movie-row.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css'],
  imports: [
    BannerComponent,
    MovieRowComponent
  ]
})
export class HomeMainComponent implements OnInit, OnDestroy {

  faSearch = faSearch;
  faUser = faUser;

  featuredMovie: any = null;

  // 🔥 HTML에 쓰이는 fetchUrl 변수들 (URL 기반 컴포넌트용)
  popularMoviesUrl: string = "";
  newReleasesUrl: string = "";
  actionMoviesUrl: string = "";

  // 🔥 데이터로 직접 사용하는 목록들
  popularMovies: any[] = [];
  newReleases: any[] = [];
  actionMovies: any[] = [];

  private scrollListener: any;

  constructor(private urlService: URLService) { }

  async ngOnInit() {

    // ================================
    // 1) URL 방식 (HTML의 fetchUrl에 전달)
    // ================================
    this.popularMoviesUrl = this.urlService.getPopularMoviesURL();
    this.newReleasesUrl = this.urlService.getPopularMoviesURL(2);
    this.actionMoviesUrl = this.urlService.getMoviesByGenreURL(28);

    // ================================
    // 2) 실제 영화 데이터 로딩
    // ================================
    this.featuredMovie = await this.urlService.fetchFeaturedMovie();
    this.popularMovies = await this.urlService.getPopularMovies(1);
    this.newReleases = await this.urlService.getPopularMovies(2);
    this.actionMovies = await this.urlService.getMoviesByGenre(28);

    // ================================
    // 3) 스크롤 이벤트
    // ================================
    this.initializeScrollListener();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  private initializeScrollListener() {
    this.scrollListener = () => {
      const header = document.querySelector('.app-header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', this.scrollListener);
  }
}
