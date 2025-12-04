import {
  Component, Input, ViewChild, ElementRef,
  OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import axios from 'axios';
import { WishlistService } from '../../util/movie/wishlist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-row',
  standalone: true,
  templateUrl: './movie-row.component.html',
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf
  ],
  styleUrls: ['./movie-row.component.css']
})
export class MovieRowComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() title!: string;
  @Input() fetchUrl!: string;  // 장르 필터링 시 변경됨

  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderWindow') sliderWindow!: ElementRef;

  movies: any[] = [];

  scrollAmount: number = 0;
  showButtons: boolean = false;
  isScrolling: boolean = false;

  touchStartX: number = 0;
  touchEndX: number = 0;

  maxScroll: number = 0;
  private resizeListener: any;

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) { }

  //---------------------------------------------
  // ⭐ fetchUrl이 바뀌면 자동으로 영화 다시 불러오기
  //---------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fetchUrl'] && !changes['fetchUrl'].firstChange) {
      this.fetchMovies();   // 장르 변경 시 필요!
    }
  }

  ngOnInit() {
    this.fetchMovies();
    this.resizeListener = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  ngAfterViewInit() {
    setTimeout(() => this.calculateMaxScroll(), 0);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  //---------------------------------------------
  // ⭐ API 요청으로 영화 가져오기
  //---------------------------------------------
  async fetchMovies() {
    if (!this.fetchUrl) return;

    try {
      const response = await axios.get(this.fetchUrl);
      this.movies = response.data.results || [];
      this.scrollAmount = 0;

      setTimeout(() => this.calculateMaxScroll(), 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  //---------------------------------------------
  // 이미지 URL 생성
  //---------------------------------------------
  getImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w300${path}`;
  }

  //---------------------------------------------
  // ⭐ 상세 페이지 이동 함수
  //---------------------------------------------
  goToDetail(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  //---------------------------------------------
  // 슬라이드 이동
  //---------------------------------------------
  slide(direction: 'left' | 'right', amount: number | null = null) {
    const slideAmount = amount || this.sliderWindow.nativeElement.clientWidth * 0.8;

    if (direction === 'left') {
      this.scrollAmount = Math.max(0, this.scrollAmount - slideAmount);
    } else {
      this.scrollAmount = Math.min(this.maxScroll, this.scrollAmount + slideAmount);
    }
  }

  //---------------------------------------------
  // 버튼 표시 조건
  //---------------------------------------------
  get atLeftEdge(): boolean {
    return this.scrollAmount <= 0;
  }

  get atRightEdge(): boolean {
    return this.scrollAmount >= this.maxScroll;
  }

  //---------------------------------------------
  // 마우스/터치/휠 이벤트
  //---------------------------------------------
  handleMouseMove() { this.showButtons = true; }
  handleMouseLeave() { this.showButtons = false; }

  handleWheel(event: WheelEvent) {
    event.preventDefault();

    if (this.isScrolling) return;
    this.isScrolling = true;

    const direction = event.deltaY > 0 ? 'right' : 'left';
    this.slide(direction);

    setTimeout(() => { this.isScrolling = false; }, 500);
  }

  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchEndX = this.touchStartX;
  }

  handleTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  handleTouchEnd() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 'right' : 'left';
      this.slide(direction, Math.abs(diff));
    }
  }

  //---------------------------------------------
  // 슬라이더 크기 계산
  //---------------------------------------------
  calculateMaxScroll() {
    if (this.slider && this.sliderWindow) {
      const sliderWidth = this.slider.nativeElement.scrollWidth;
      const windowWidth = this.sliderWindow.nativeElement.clientWidth;

      this.maxScroll = Math.max(0, sliderWidth - windowWidth);
    }
  }

  handleResize() {
    this.calculateMaxScroll();
    this.scrollAmount = Math.min(this.scrollAmount, this.maxScroll);
  }

  //---------------------------------------------
  // ⭐ 위시리스트
  //---------------------------------------------
  toggleWishlist(movie: any) {
    this.wishlistService.toggleWishlist(movie);
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistService.isInWishlist(movieId);
  }
}
