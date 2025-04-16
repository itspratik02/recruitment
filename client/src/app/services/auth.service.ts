import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private baseUrl = 'http://localhost:8080/api/users'; 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/login`, { email, password });
  }

  checkAuthStatus(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('userEmail');
  }
}