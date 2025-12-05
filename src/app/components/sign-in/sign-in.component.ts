import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../util/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SignInComponent implements OnInit, OnDestroy {

  isLoginVisible = true;

  email = '';
  password = '';
  registerEmail = '';
  registerPassword = '';
  confirmPassword = '';
  rememberMe = false;
  acceptTerms = false;

  isEmailFocused = false;
  isPasswordFocused = false;
  isRegisterEmailFocused = false;
  isRegisterPasswordFocused = false;
  isConfirmPasswordFocused = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // ⭐ 자동 로그인
    if (this.authService.autoLogin()) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy() { }

  get isLoginFormValid(): boolean {
    return !!this.email && !!this.password;
  }

  get isRegisterFormValid(): boolean {
    return !!this.registerEmail &&
      !!this.registerPassword &&
      !!this.confirmPassword &&
      this.registerPassword === this.confirmPassword &&
      this.acceptTerms;
  }

  toggleCard() {
    this.isLoginVisible = !this.isLoginVisible;
    setTimeout(() => {
      document.getElementById('register')?.classList.toggle('register-swap');
      document.getElementById('login')?.classList.toggle('login-swap');
    }, 50);
  }

  focusInput(name: string) {
    (this as any)[`is${name.charAt(0).toUpperCase() + name.slice(1)}Focused`] = true;
  }

  blurInput(name: string) {
    (this as any)[`is${name.charAt(0).toUpperCase() + name.slice(1)}Focused`] = false;
  }

  // ⭐ 로그인
  handleLogin() {
    this.authService.tryLogin(this.email, this.password, this.rememberMe).subscribe({
      next: (user) => {
        this.router.navigate(['/']);
      },
      error: () => alert('Login failed')
    });
  }

  // ⭐ 회원가입
  handleRegister() {
    this.authService.tryRegister(this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        alert('Registered successfully!');
        this.toggleCard();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }
}
