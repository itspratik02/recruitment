import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check auth status when service is initialized
    this.checkAuthStatus();
  }

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        this.isAuthenticatedSubject.next(true);
        localStorage.setItem('isLoggedIn', 'true');
        // Store user email for persistence
        localStorage.setItem('userEmail', email);
        resolve();
      }, 1500);
    });
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  }

  checkAuthStatus(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('userEmail');
  }
}