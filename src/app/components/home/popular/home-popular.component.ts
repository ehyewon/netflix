import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import { MovieInfiniteScrollComponent } from '../../../views/views/movie-infinite-scroll.component';
import { URLService } from '../../../util/movie/URL';
import { MovieGridComponent } from '../../../views/views/movie-grid.component';

@Component({
  selector: 'app-home-popular',
  standalone: true,
  imports: [
    CommonModule,
    MovieGridComponent,
    MovieInfiniteScrollComponent,
    FontAwesomeModule
  ],
  templateUrl: './home-popular.component.html',
  styleUrls: ['./home-popular.component.css']
})
export class HomePopularComponent implements OnInit {

  faTh = faTh;
  faBars = faBars;

  apiKey = localStorage.getItem('TMDb-Key') || 'b4303f4fca2d461848894c447fbf6a72';
  currentView = 'grid';

  // ⭐ 이제 HomePopular는 "보여줄지 여부만" 컨트롤
  showTopButton = false;

  // ⭐ popular infinite scroll 컴포넌트 직접 접근
  @ViewChild(MovieInfiniteScrollComponent)
  infiniteScrollComp!: MovieInfiniteScrollComponent;

  constructor(private urlService: URLService) { }

  ngOnInit(): void {
    this.enableScroll();
  }

  setView(view: string): void {
    this.currentView = view;

    if (view === 'grid') {
      this.showTopButton = false;
      this.enableScroll();
    } else {
      // ⭐ list 모드 들어올 때 즉시 버튼 표시
      this.showTopButton = true;
      this.enableScroll();
    }
  }

  private enableScroll(): void {
    document.body.style.overflow = 'auto';
  }

  // ⭐ Top 버튼 눌렀을 때 popular infinite-scroll 내부로 command 전달
  scrollToTop(): void {
    if (this.infiniteScrollComp) {
      this.infiniteScrollComp.scrollToTopAndReset();
    }
  }

  fetFetchURL(): string {
    return this.urlService.getPopularMoviesURL();
  }
}
