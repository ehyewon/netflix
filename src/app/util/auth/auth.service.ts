import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ⭐ 로그인
  tryLogin(email: string, password: string, keepLogin: boolean = false): Observable<any> {
    return new Observable(observer => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const user = users.find((u: any) => u.id === email && u.password === password);

      if (!user) {
        observer.error('Login failed');
        observer.complete();
        return;
      }

      // 🔥 현재 로그인한 사용자 정보 저장
      localStorage.setItem('currentUser', JSON.stringify(user));

      // 🔥 로그인 상태 저장
      localStorage.setItem('authStatus', JSON.stringify({
        isLoggedIn: true,
        keepLogin,
        loginAt: new Date()
      }));

      observer.next(user);
      observer.complete();
    });
  }

  // ⭐ 회원가입
  tryRegister(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = users.some((u: any) => u.id === email);

        if (exists) {
          throw new Error('User already exists');
        }

        const newUser = { id: email, password };
        users.push(newUser);

        localStorage.setItem('users', JSON.stringify(users));

        observer.next(true);
        observer.complete();

      } catch (err) {
        observer.error(err);
        observer.complete();
      }
    });
  }

  // ⭐ 자동 로그인 체크
  autoLogin(): boolean {
    const authStatus = JSON.parse(localStorage.getItem('authStatus') || '{}');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (authStatus?.isLoggedIn && currentUser) {
      if (authStatus.keepLogin === true) {
        return true;
      }
    }
    return false;
  }

  // ⭐ 로그아웃
  logout() {
    localStorage.removeItem('authStatus');
    localStorage.removeItem('currentUser');
  }

  // ⭐ 현재 로그인된 사용자 가져오기
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

}
