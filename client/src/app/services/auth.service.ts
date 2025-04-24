import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/users'; 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private authState = new BehaviorSubject<{ isAuthenticated: boolean; role: string | null }>({
    isAuthenticated: !!localStorage.getItem('jwtToken'),
    role: localStorage.getItem('userRole')
  });

  get currentAuthState() {
    return this.authState.getValue();
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ role: string; token: string }> {
    return this.http.post<{ role: string; token: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.saveToken(response.token);
        localStorage.setItem('userRole', response.role);
        this.authState.next({
          isAuthenticated: true,
          role: response.role
        });
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }
}