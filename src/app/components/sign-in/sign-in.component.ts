import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../util/auth/auth.service';
import { WishlistService } from '../../util/movie/wishlist';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastComponent } from '../../shared/toast/toast.component';


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    standalone: true,
    imports: [FormsModule, CommonModule, ToastComponent]
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

    // Input focus states
    isEmailFocused = false;
    isPasswordFocused = false;
    isRegisterEmailFocused = false;
    isRegisterPasswordFocused = false;
    isConfirmPasswordFocused = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private wishlistService: WishlistService,
        private toast: ToastService              // ⭐ 토스트 주입
    ) { }

    ngOnInit() { }
    ngOnDestroy() { }

    get isLoginFormValid(): boolean {
        return !!this.email && !!this.password;
    }

    get isRegisterFormValid(): boolean {
        return !!this.registerEmail && !!this.registerPassword && !!this.confirmPassword;
    }

    toggleCard() {
        this.isLoginVisible = !this.isLoginVisible;

        setTimeout(() => {
            document.getElementById('register')?.classList.toggle('register-swap');
            document.getElementById('login')?.classList.toggle('login-swap');
        }, 50);
    }

    focusInput(inputName: string) {
        (this as any)[`is${inputName.charAt(0).toUpperCase() + inputName.slice(1)}Focused`] = true;
    }

    blurInput(inputName: string) {
        (this as any)[`is${inputName.charAt(0).toUpperCase() + inputName.slice(1)}Focused`] = false;
    }

    // ---------------- LOGIN ----------------
    handleLogin() {

        if (!this.isValidEmail(this.email)) {
            this.toast.show("올바른 이메일 형식을 입력해주세요.", "error");
            return;
        }

        this.authService.tryLogin(this.email, this.password).subscribe({
            next: () => {
                this.toast.show("로그인 성공!", "success");
                this.wishlistService.refreshAfterLoginOrLogout();
                this.router.navigate(['/']);
            },
            error: () => this.toast.show("로그인 실패: 이메일 또는 비밀번호를 확인해주세요", "error")
        });
    }

    // ---------------- REGISTER ----------------
    handleRegister() {

        if (!this.isValidEmail(this.registerEmail)) {
            this.toast.show("올바른 이메일 형식을 입력해주세요.", "error");
            return;
        }

        if (!this.registerPassword || !this.confirmPassword) {
            this.toast.show("비밀번호를 모두 입력해주세요.", "error");
            return;
        }

        if (this.registerPassword !== this.confirmPassword) {
            this.toast.show("비밀번호가 일치하지 않습니다.", "error");
            return;
        }

        if (!this.acceptTerms) {
            this.toast.show("약관에 동의해 주세요.", "error");
            return;
        }

        this.authService.tryRegister(this.registerEmail, this.registerPassword).subscribe({
            next: () => {
                this.toast.show("회원가입 성공!", "success");
                this.toggleCard();
            },
            error: (err) => this.toast.show(err.message, "error")
        });
    }

    private isValidEmail(email: string): boolean {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
}
