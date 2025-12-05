import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../../../models/types';
import { AuthService } from '../auth/auth.service';   // ⭐ 추가

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistSubject = new BehaviorSubject<Movie[]>([]);
  wishlist$: Observable<Movie[]> = this.wishlistSubject.asObservable();

  constructor(private authService: AuthService) {   // ⭐ 기존 코드 유지 + authService 주입
    this.loadWishlist();  // ⭐ 기존 코드 유지
  }

  /** ⭐ 계정별 localStorage key 반환 */
  private getWishlistKey(): string {
    const user = this.authService.getCurrentUser();
    return user ? `movieWishlist-${user.id}` : 'movieWishlist-guest';
  }

  /** ⭐ 계정별 위시리스트 불러오기 */
  private loadWishlist(): void {
    const key = this.getWishlistKey();
    const storedWishlist = localStorage.getItem(key);

    if (storedWishlist) {
      this.wishlistSubject.next(JSON.parse(storedWishlist));
    } else {
      this.wishlistSubject.next([]);  // ⭐ 기존 코드 유지 + 초기화
    }
  }

  /** ⭐ 계정별로 위시리스트 저장 */
  private saveWishlist(): void {
    const key = this.getWishlistKey();
    localStorage.setItem(key, JSON.stringify(this.wishlistSubject.value));
  }

  toggleWishlist(movie: Movie): void {
    const currentWishlist = this.wishlistSubject.value;
    const index = currentWishlist.findIndex(item => item.id === movie.id);

    if (index === -1) {
      this.wishlistSubject.next([...currentWishlist, movie]);
    } else {
      this.wishlistSubject.next(
        currentWishlist.filter(item => item.id !== movie.id)
      );
    }

    this.saveWishlist();   // ⭐ 기존 코드 유지
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlistSubject.value.some(item => item.id === movieId);
  }

  getCurrentWishlist(): Movie[] {
    return this.wishlistSubject.value;
  }

  /** ⭐ 로그인 / 로그아웃 후 호출해야 함 */
  refreshAfterLoginOrLogout(): void {
    this.loadWishlist();
  }
}
