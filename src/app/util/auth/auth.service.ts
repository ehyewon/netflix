import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tryLogin(email: string, password: string, saveToken = true): Observable<any> {
    return new Observable(observer => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.id === email && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user)); // ⭐ 로그인 유지
        observer.next(user);
        observer.complete();
      } else {
        observer.error('Login failed');
      }
    });
  }

  tryRegister(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((u: any) => u.id === email)) {
        observer.error(new Error('User already exists'));
        return;
      }

      const newUser = { id: email, password };
      users.push(newUser);

      localStorage.setItem('users', JSON.stringify(users));
      observer.next(true);
      observer.complete();
    });
  }

  // ⭐ 현재 로그인한 유저 반환
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // ⭐ 자동 로그인 확인 (AuthGuard에서 사용)
  autologin(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  // ⭐ 로그아웃
  logout() {
    localStorage.removeItem('currentUser');
  }
}
