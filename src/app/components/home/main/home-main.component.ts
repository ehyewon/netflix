import { Component, OnInit, OnDestroy } from '@angular/core';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { URLService } from '../../../util/movie/URL';
import { BannerComponent } from '../../../views/home-main/banner.component';
import { MovieRowComponent } from '../../../views/home-main/movie-row.component';

@Component({
  selector: 'app-home',
  templateUrl: './home-main.component.html',
  standalone: true,
  styleUrls: ['./home-main.component.css'],
  imports: [
    BannerComponent,
    MovieRowComponent
  ]
})

export class HomeMainComponent implements OnInit, OnDestroy {
  faSearch = faSearch;
  faUser = faUser;

  // ✔ 수정 1: localStorage key 이름을 'TMDb-Key'로 고정
  apiKey: string = localStorage.getItem('TMDb-Key') || '';

  featuredMovie: any = null;
  popularMoviesUrl: string = '';
  newReleasesUrl: string = '';
  actionMoviesUrl: string = '';

  private scrollListener: any;

  constructor(
    private urlService: URLService
  ) {
    this.popularMoviesUrl = urlService.getURL4PopularMovies(this.apiKey);
    this.newReleasesUrl = urlService.getURL4ReleaseMovies(this.apiKey);
    this.actionMoviesUrl = urlService.getURL4GenreMovies(this.apiKey, '28');
  }

  ngOnInit() {
    this.loadFeaturedMovie();
    this.initializeScrollListener();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  // ✔ 수정 2: async/await → then()으로 변경 (Angular 화면 갱신 문제 해결)
  private loadFeaturedMovie() {
    this.urlService.fetchFeaturedMovie(this.apiKey)
      .then(movie => {
        this.featuredMovie = movie;
      });
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
