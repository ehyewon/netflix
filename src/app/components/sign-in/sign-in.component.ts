import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../util/auth/auth.service';
import { WishlistService } from '../../util/movie/wishlist';


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
        private router: Router,
        private wishlistService: WishlistService   // ⭐ 추가!!
    ) { }

    ngOnInit() {
        // onMounted 로직을 여기에 구현
    }

    ngOnDestroy() {
        // onUnmounted 로직을 여기에 구현
    }

    get isLoginFormValid(): boolean {
        return !!this.email && !!this.password;
    }

    get isRegisterFormValid(): boolean {
        return !!this.registerEmail &&
            !!this.registerPassword &&
            !!this.confirmPassword;   // ⭐ 약관 조건 제거
    }

    toggleCard() {
        this.isLoginVisible = !this.isLoginVisible;

        setTimeout(() => {
            document.getElementById('register')?.classList.toggle('register-swap');
            document.getElementById('login')?.classList.toggle('login-swap');
        }, 50);
    }

    focusInput(inputName: string) {
        switch (inputName) {
            case 'email':
                this.isEmailFocused = true;
                break;
            case 'password':
                this.isPasswordFocused = true;
                break;
            case 'registerEmail':
                this.isRegisterEmailFocused = true;
                break;
            case 'registerPassword':
                this.isRegisterPasswordFocused = true;
                break;
            case 'confirmPassword':
                this.isConfirmPasswordFocused = true;
                break;
        }
    }

    blurInput(inputName: string) {
        switch (inputName) {
            case 'email':
                this.isEmailFocused = false;
                break;
            case 'password':
                this.isPasswordFocused = false;
                break;
            case 'registerEmail':
                this.isRegisterEmailFocused = false;
                break;
            case 'registerPassword':
                this.isRegisterPasswordFocused = false;
                break;
            case 'confirmPassword':
                this.isConfirmPasswordFocused = false;
                break;
        }
    }

    handleLogin() {
        if (!this.isValidEmail(this.email)) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        this.authService.tryLogin(this.email, this.password).subscribe({
            next: () => {
                this.wishlistService.refreshAfterLoginOrLogout();
                this.router.navigate(['/']);
            },
            error: () => alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요')
        });
    }


    handleRegister() {
        // 이메일 형식 검사
        if (!this.isValidEmail(this.registerEmail)) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        // 비밀번호 입력 확인
        if (!this.registerPassword || !this.confirmPassword) {
            alert("비밀번호를 모두 입력해주세요.");
            return;
        }

        // 비밀번호 일치 검사
        if (this.registerPassword !== this.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // ⭐ 약관 동의 체크
        if (!this.acceptTerms) {
            alert("약관에 동의해 주세요.");
            return;
        }

        // 회원가입 시도
        this.authService.tryRegister(this.registerEmail, this.registerPassword).subscribe({
            next: () => {
                alert("회원가입에 성공했습니다!");
                this.toggleCard();
            },
            error: (err) => alert(err.message)
        });
    }

    private isValidEmail(email: string): boolean {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

}
