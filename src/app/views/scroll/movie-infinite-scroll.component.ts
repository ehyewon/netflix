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
    hasMore = true;

    // ⭐ Top 버튼 여부
    showTopButton = false;

    private wishlistTimer: number | null = null;
    private observer!: IntersectionObserver;
    private readonly resizeListener: () => void;

    // ⭐ 스크롤 감지 리스너 (window ❌ → gridContainer 내부 div ⭕)
    private readonly scrollListener: any;

    constructor(private wishlistService: WishlistService) {
        this.resizeListener = this.handleResize.bind(this);
        this.scrollListener = this.handleScroll.bind(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes['genreCode'] && !changes['genreCode'].firstChange) ||
            (changes['sortingOrder'] && !changes['sortingOrder'].firstChange) ||
            (changes['voteEverage'] && !changes['voteEverage'].firstChange) ||
            (changes['keyword'] && !changes['keyword'].firstChange)
        ) {
            this.resetMovies();
        }
    }

    ngOnInit(): void {
        this.setupIntersectionObserver();
        this.fetchMovies();
        this.handleResize();
        window.addEventListener('scroll', this.scrollListener);
        window.addEventListener('resize', this.resizeListener);
    }

    ngAfterViewInit(): void {
        // ⭐ movie-grid 내부 스크롤을 감지해야 Top 버튼이 동작함
        this.gridContainer.nativeElement.addEventListener('scroll', this.scrollListener);
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.scrollListener);

        // ⭐ div 스크롤 제거
        if (this.gridContainer) {
            this.gridContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
        }

        if (this.observer) this.observer.disconnect();
        if (this.wishlistTimer) clearTimeout(this.wishlistTimer);
    }

    private setupIntersectionObserver(): void {
        if (this.observer) this.observer.disconnect();

        this.observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry.isIntersecting && !this.isLoading) {
                    if (this.hasMore) {
                        this.fetchMovies();
                    } else {
                        this.isLoading = true;
                        setTimeout(() => this.isLoading = false, 1000);
                    }
                }
            },
            { root: null, rootMargin: '300px', threshold: 0.0 }
        );

        setTimeout(() => {
            if (this.loadingTrigger?.nativeElement) {
                this.observer.observe(this.loadingTrigger.nativeElement);
            }
        }, 300);
    }

    async fetchMovies(): Promise<void> {
        if (this.isLoading || !this.hasMore) return;

        this.isLoading = true;

        try {
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

            if (this.keyword.trim()) params.query = this.keyword;
            else if (this.genreCode !== '0') params.with_genres = this.genreCode;

            const response: AxiosResponse<any> = await axios.get(url, { params });
            const newMovies = response.data.results;

            if (newMovies.length > 0) {
                let movieArray = [...this.movies, ...newMovies];

                if (this.sortingOrder !== 'all') {
                    movieArray = movieArray.filter(
                        (m) => m.original_language === this.sortingOrder
                    );
                }

                movieArray = movieArray.filter((m) => {
                    if (this.voteEverage === -1) return true;
                    if (this.voteEverage === -2) return m.vote_average <= 4;
                    return (
                        m.vote_average >= this.voteEverage &&
                        m.vote_average < this.voteEverage + 1
                    );
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

    private resetMovies(): void {
        this.movies = [];
        this.currentPage = 1;
        this.hasMore = true;
        this.fetchMovies();
    }

    getImageUrl(path: string): string {
        return path
            ? `https://image.tmdb.org/t/p/w300${path}`
            : '/placeholder-image.jpg';
    }

    get visibleMovieGroups(): Movie[][] {
        return this.movies.reduce<Movie[][]>((result, item, index) => {
            const groupIndex = Math.floor(index / this.rowSize);
            if (!result[groupIndex]) result[groupIndex] = [];
            result[groupIndex].push(item);
            return result;
        }, []);
    }

    private handleResize(): void {
        this.isMobile = window.innerWidth <= 768;

        if (this.gridContainer) {
            const containerWidth = this.gridContainer.nativeElement.offsetWidth;
            const movieCardWidth = this.isMobile ? 100 : 300;
            const gap = this.isMobile ? 10 : 15;
            this.rowSize = Math.floor(containerWidth / (movieCardWidth + gap));
        }
    }

    // ⭐⭐ Top 버튼 표시 — window가 아니라 gridContainer 스크롤 기준
    private handleScroll(): void {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.showTopButton = scrollTop > 200;
    }


    // ⭐⭐ Top 버튼 눌렀을 때 movie-grid를 맨 위로 스크롤
    scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    toggleWishlist(movie: Movie): void {
        if (this.wishlistTimer) clearTimeout(this.wishlistTimer);
        this.wishlistTimer = window.setTimeout(
            () => this.wishlistService.toggleWishlist(movie),
            800
        );
    }

    isInWishlist(movieId: number): boolean {
        return this.wishlistService.isInWishlist(movieId);
    }
}
