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

  featuredMovie: any = null;
  popularMoviesUrl: string = '';
  newReleasesUrl: string = '';
  actionMoviesUrl: string = '';

  private scrollListener: any;

  constructor(private urlService: URLService) { }

  ngOnInit() {
    // URL 생성은 환경변수 기반 URLService가 처리
    this.popularMoviesUrl = this.urlService.getURL4PopularMovies();
    this.newReleasesUrl = this.urlService.getURL4ReleaseMovies();
    this.actionMoviesUrl = this.urlService.getURL4GenreMovies('28');

    this.loadFeaturedMovie();
    this.initializeScrollListener();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener);
  }

  private async loadFeaturedMovie() {
    this.featuredMovie = await this.urlService.fetchFeaturedMovie();

    if (!this.featuredMovie) {
      console.warn("배너 영화 로드 실패");
    }
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
