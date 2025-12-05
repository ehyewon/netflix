import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faUser, faTicket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../util/auth/auth.service';
import { WishlistService } from '../../util/movie/wishlist';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class HeaderComponent implements OnInit, OnDestroy {

  isScrolled = false;
  isMobileMenuOpen = false;

  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private wishlistService: WishlistService,
    library: FaIconLibrary
  ) {
    library.addIcons(faSearch, faUser, faTicket, faBars, faTimes);
  }

  ngOnInit() {
    // 로그인 상태 로드
    this.currentUser = this.authService.getCurrentUser();

    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // 프로필 아이콘 클릭 시 동작
  onProfileClick() {
    if (this.currentUser) {
      // 로그인된 상태 → 로그아웃
      this.logout();
    } else {
      // 로그인 안 된 상태 → 로그인 페이지로 이동
      this.router.navigate(['/signin']);
    }
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.wishlistService.refreshAfterLoginOrLogout();
    this.router.navigate(['/signin']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  handleScroll = () => {
    this.isScrolled = window.scrollY > 50;
  }
}
