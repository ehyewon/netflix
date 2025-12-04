import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieSearchComponent } from '../../views/search/movie-search.component';
import { MovieInfiniteScrollComponent } from '../../views/scroll/movie-infinite-scroll.component';
import { SearchOptions } from '../../../models/types';

// ⭐⭐ 환경변수 경로는 이걸로 맞춰야 함 (너 프로젝트에 따라 다름)
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-search',
  standalone: true,
  imports: [CommonModule, MovieSearchComponent, MovieInfiniteScrollComponent],
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css']
})
export class HomeSearchComponent {

  // ⭐ 키가 존재해야 정확하게 동작함
  apiKey: string = environment.TMDB_KEY;

  genreId: string = '0';
  ageId: number = -1;
  sortId: string = 'all';

  readonly genreCode: { [key: string]: number } = {
    '장르 (전체)': 0,
    'Action': 28,
    'Adventure': 12,
    'Comedy': 35,
    'Crime': 80,
    'Family': 10751
  };

  readonly sortingCode: { [key: string]: string } = {
    '언어 (전체)': 'all',
    '영어': 'en',
    '한국어': 'ko'
  };

  readonly ageCode: { [key: string]: number } = {
    '평점 (전체)': -1,
    '9~10': 9,
    '8~9': 8,
    '7~8': 7,
    '6~7': 6,
    '5~6': 5,
    '4~5': 4,
    '4점 이하': -2
  };

  changeOptions(options: SearchOptions): void {
    this.genreId = `${this.genreCode[options.originalLanguage]}`;
    this.ageId = this.ageCode[options.translationLanguage];
    this.sortId = this.sortingCode[options.sorting];
  }
}
