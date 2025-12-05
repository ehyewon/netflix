import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie } from '../../../models/types';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistSubject = new BehaviorSubject<Movie[]>([]);
  wishlist$: Observable<Movie[]> = this.wishlistSubject.asObservable();

  constructor(private authService: AuthService) {
    this.loadWishlist();
  }

  /** ⭐ 계정마다 다른 key 사용 */
  private getWishlistKey(): string {
    const user = this.authService.getCurrentUser();
    return user ? `movieWishlist-${user.id}` : 'movieWishlist-guest';
  }

  /** ⭐ 해당 계정의 찜 목록 불러오기 */
  private loadWishlist(): void {
    const key = this.getWishlistKey();
    const storedWishlist = localStorage.getItem(key);

    if (storedWishlist) {
      this.wishlistSubject.next(JSON.parse(storedWishlist));
    } else {
      this.wishlistSubject.next([]);  // 없는 경우 초기화
    }
  }

  /** ⭐ 해당 계정의 찜 목록 저장 */
  private saveWishlist(): void {
    const key = this.getWishlistKey();
    localStorage.setItem(key, JSON.stringify(this.wishlistSubject.value));
  }

  /** ⭐ 영화 찜 토글 */
  toggleWishlist(movie: Movie): void {
    const currentWishlist = this.wishlistSubject.value;
    const index = currentWishlist.findIndex(item => item.id === movie.id);

    if (index === -1) {
      // 추가
      this.wishlistSubject.next([...currentWishlist, movie]);
    } else {
      // 제거
      this.wishlistSubject.next(
        currentWishlist.filter(item => item.id !== movie.id)
      );
    }

    this.saveWishlist();
  }

  /** ⭐ 영화가 위시리스트에 포함되어 있는지 체크 */
  isInWishlist(movieId: number): boolean {
    return this.wishlistSubject.value.some(item => item.id === movieId);
  }

  /** ⭐ 현재 위시리스트 반환 */
  getCurrentWishlist(): Movie[] {
    return this.wishlistSubject.value;
  }

  /** ⭐ 로그인/로그아웃 후 위시리스트 새로 로드 */
  refreshAfterLoginOrLogout() {
    this.loadWishlist();
  }
}
