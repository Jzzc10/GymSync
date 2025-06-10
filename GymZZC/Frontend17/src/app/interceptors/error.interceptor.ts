// interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Error 401 - No autorizado
        if (error.status === 401) {
          this.handleUnauthorizedError();
        }
        
        // Error 403 - Prohibido
        if (error.status === 403) {
          console.error('Acceso prohibido:', error.message);
          // Opcional: mostrar mensaje de error o redirigir
        }
        
        // Error 404 - No encontrado
        if (error.status === 404) {
          console.error('Recurso no encontrado:', error.message);
        }
        
        // Error 500 - Error interno del servidor
        if (error.status >= 500) {
          console.error('Error del servidor:', error.message);
          // Opcional: mostrar mensaje de error genérico
        }
        
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(): void {
    // Limpiar datos de autenticación
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
    
    // Redirigir al login
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: this.router.url }
    });
  }
}