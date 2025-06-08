import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fuente de verdad para el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  // Observable público para componentes
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post('/api/login', credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('auth_token', response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    this.http.post('/api/logout', {}).subscribe(() => {
      localStorage.removeItem('auth_token');
      this.isAuthenticatedSubject.next(false);
    });
  }
}