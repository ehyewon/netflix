import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import axios, { AxiosResponse } from 'axios';
import { Movie } from '../../../models/types';
import { WishlistService } from '../../util/movie/wishlist';

@Component({
    selector: 'app-movie-infinite-scroll',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './movie-infinite-scroll.component.html',
    styleUrls: ['./movie-infinite-scroll.component.css']
})
export class MovieInfiniteScrollComponent
    implements OnInit, OnDestroy, OnChanges {

    @Input() genreCode!: string;
    @Input() apiKey!: string;
    @Input() sortingOrder: string = 'all';
    @Input() voteEverage: number = 100;
    @Input() keyword: string = '';

    @ViewChild('gridContainer') gridContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('loadingTrigger') loadingTrigger!: ElementRef<HTMLDivElement>;

    movies: Movie[] = [];
    currentPage = 1;
    rowSize = 4;
    isLoading = false;
    isMobile = window.innerWidth <= 768;
    currentView = 'grid';
    hasMore = true;
    showTopButton = false;
    private wishlistTimer: number | null = null;
    private observer!: IntersectionObserver;
    private readonly resizeListener: () => void;
    private readonly scrollListener: () => void;

    constructor(private wishlistService: WishlistService) {
        this.resizeListener = this.handleResize.bind(this);
        this.scrollListener = this.handleScroll.bind(this);
    }

    // ⭐⭐⭐ 장르/언어/평점 변경 감지 → 영화 목록 초기화 후 재검색 ⭐⭐⭐
    ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes['genreCode'] && !changes['genreCode'].firstChange) ||
            (changes['sortingOrder'] && !changes['sortingOrder'].firstChange) ||
            (changes['voteEverage'] && !changes['voteEverage'].firstChange) ||
            (changes['keyword'] && !changes['keyword'].firstChange)   // ⭐ 추가됨
        ) {
            this.resetMovies();
        }
    }

    ngOnInit(): void {
        this.setupIntersectionObserver();
        this.fetchMovies();
        this.handleResize();

        window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.scrollListener);
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.resizeListener);
        window.removeEventListener('scroll', this.scrollListener);

        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.wishlistTimer) {
            clearTimeout(this.wishlistTimer);
        }
    }

    private setupIntersectionObserver(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
                    this.fetchMovies();
                }
            },
            { rootMargin: '100px', threshold: 0.1 }
        );

        setTimeout(() => {
            if (this.loadingTrigger) {
                this.observer.observe(this.loadingTrigger.nativeElement);
            }
        }, 0);
    }

    // ⭐⭐⭐ 필터링된 API 호출 ⭐⭐⭐
    async fetchMovies(): Promise<void> {
        if (this.isLoading || !this.hasMore) return;

        this.isLoading = true;
        try {
            // 🔥 검색어가 있을 경우 → 검색 API 사용
            const url = this.keyword.trim()
                ? 'https://api.themoviedb.org/3/search/movie'
                : (this.genreCode === '0'
                    ? 'https://api.themoviedb.org/3/movie/popular'
                    : 'https://api.themoviedb.org/3/discover/movie');

            const params: any = {
                api_key: this.apiKey,
                language: 'ko-KR',
                page: this.currentPage
            };

            // 🔍 검색어 우선 적용
            if (this.keyword.trim()) {
                params.query = this.keyword;
            }
            // 🔍 검색어 없으면 장르 적용
            else if (this.genreCode !== '0') {
                params.with_genres = this.genreCode;
            }

            const response: AxiosResponse<any> = await axios.get(url, { params });
            const newMovies = response.data.results;

            if (newMovies.length > 0) {

                let movieArray = [...this.movies, ...newMovies];

                // ⭐ 언어 필터
                if (this.sortingOrder !== 'all') {
                    movieArray = movieArray.filter((movie) =>
                        movie.original_language === this.sortingOrder
                    );
                }

                // ⭐ 평점 필터
                movieArray = movieArray.filter((movie) => {
                    if (this.voteEverage === -1) return true;
                    if (this.voteEverage === -2) return movie.vote_average <= 4;
                    return movie.vote_average >= this.voteEverage &&
                        movie.vote_average < this.voteEverage + 1;
                });

                this.movies = movieArray;
                this.currentPage++;

            } else {
                this.hasMore = false;
            }

        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            this.isLoading = false;
        }
    }

    // ⭐⭐⭐ 필터 변경 시 전체 초기화 ⭐⭐⭐
    private resetMovies(): void {
        this.movies = [];
        this.currentPage = 1;
        this.hasMore = true;
        this.fetchMovies();
    }

    getImageUrl(path: string): string {
        return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
    }

    get visibleMovieGroups(): Movie[][] {
        return this.movies.reduce<Movie[][]>((resultArray, item, index) => {
            const groupIndex = Math.floor(index / this.rowSize);
            if (!resultArray[groupIndex]) resultArray[groupIndex] = [];
            resultArray[groupIndex].push(item);
            return resultArray;
        }, []);
    }

    private handleResize(): void {
        this.isMobile = window.innerWidth <= 768;
        if (this.gridContainer) {
            const containerWidth = this.gridContainer.nativeElement.offsetWidth;
            const movieCardWidth = this.isMobile ? 100 : 300;
            const horizontalGap = this.isMobile ? 10 : 15;
            this.rowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
        }
    }

    private handleScroll(): void {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.showTopButton = scrollTop > 300;
    }

    scrollToTopAndReset(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.resetMovies();
    }

    toggleWishlist(movie: Movie): void {
        if (this.wishlistTimer) clearTimeout(this.wishlistTimer);
        this.wishlistTimer = window.setTimeout(() => {
            this.wishlistService.toggleWishlist(movie);
        }, 0);
    }

    isInWishlist(movieId: number): boolean {
        return this.wishlistService.isInWishlist(movieId);
    }


}

