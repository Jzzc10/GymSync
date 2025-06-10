import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { UsuarioService, Usuario, LoginCredentials, LoginResponse } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private usuarioService: UsuarioService) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  updateUserProfile(updatedUser: Usuario): void {
    // Actualizar localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Actualizar BehaviorSubjects
    this.currentUserSubject.next(updatedUser);
  }

  loginWithRole(credentials: LoginCredentials, role: string): Observable<LoginResponse> {
    return this.usuarioService.login(credentials).pipe(
      tap(response => {
        if (response && response.usuario && response.rol === role) {
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          localStorage.setItem('authToken', 'logged-in');
          localStorage.setItem('userRole', response.rol);
          this.currentUserSubject.next(response.usuario);
          this.isLoggedInSubject.next(true);
          // SOLUCIÓN: Remover return innecesario
        } else {
          throw new Error('Rol no coincide');
        }
      }),
      catchError(error => {
        console.error('Error de autenticación:', error);
        throw error;
      })
    );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.usuarioService.login(credentials).pipe(
      tap(response => {
        if (response && response.usuario) {
          // Guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          localStorage.setItem('authToken', 'logged-in'); // Token simple para este ejemplo
          localStorage.setItem('userRole', response.rol);
          
          // Actualizar BehaviorSubjects
          this.currentUserSubject.next(response.usuario);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    // Actualizar BehaviorSubjects
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id || null : null;
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN';
  }

  isEntrenador(): boolean {
    const role = this.getUserRole();
    return role === 'ENTRENADOR';
  }

  isCliente(): boolean {
    const role = this.getUserRole();
    return role === 'CLIENTE';
  }

  // Método para verificar si el usuario tiene permisos para una acción específica
  hasPermission(requiredRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? requiredRoles.includes(userRole) : false;
  }

  // Método para verificar si el usuario puede acceder a datos de otro usuario
  canAccessUser(targetUserId: number): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Admin puede acceder a cualquier usuario
    if (this.isAdmin()) return true;

    // Entrenador puede acceder a sus clientes (esto requeriría lógica adicional)
    if (this.isEntrenador()) return true;

    // Cliente solo puede acceder a sus propios datos
    return currentUser.id === targetUserId;
  }
}