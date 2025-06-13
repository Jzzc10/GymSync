import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { UsuarioService, Usuario, LoginCredentials, LoginResponse } from './usuario.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private usuarioService: UsuarioService) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');
      const storedRole = localStorage.getItem('userRole'); // Añadido para consistencia
      
      console.log('Inicializando estado de autenticación...');
      console.log('Usuario almacenado:', storedUser);
      console.log('Token almacenado:', !!storedToken);
      console.log('Rol almacenado:', storedRole);
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        if (this.isValidUser(user)) {
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
          
          // Sincronizar rol en localStorage si no existe
          if (!storedRole && user.rol) {
            localStorage.setItem('userRole', user.rol);
          }
          
          console.log('Estado de auth inicializado correctamente para:', user.email, 'con rol:', user.rol);
        } else {
          console.log('Usuario almacenado no es válido, limpiando datos');
          this.clearAuthData();
        }
      } else {
        console.log('No hay datos de autenticación almacenados');
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearAuthData();
    }
  }

  private isValidUser(user: any): boolean {
    const isValid = user && 
           typeof user.id === 'number' && 
           typeof user.nombre === 'string' && 
           typeof user.email === 'string' && 
           ['CLIENTE', 'ENTRENADOR', 'ADMIN'].includes(user.rol);
    
    console.log('Validando usuario:', user, 'Es válido:', isValid);
    return isValid;
  }

  private clearAuthData(): void {
    console.log('Limpiando datos de autenticación');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // Añadido para consistencia
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  login(credentials: LoginCredentials) {
    console.log('Intentando login con:', credentials.email);
    return this.usuarioService.login(credentials).pipe(
      tap(response => {
        console.log('Respuesta de login recibida:', response);
        if (response?.usuario && this.isValidUser(response.usuario)) {
          this.setAuthData(response);
        } else {
          console.error('Respuesta de login inválida:', response);
          throw new Error('Respuesta de login inválida');
        }
      }),
      catchError(error => {
        console.error('Error de autenticación:', error);
        throw error;
      })
    );
  }

  verifyPassword(credentials: LoginCredentials): Observable<boolean> {
    return this.usuarioService.login(credentials).pipe(
      map(response => {
        // Solo verificar éxito sin alterar estado
        return !!response?.usuario;
      }),
      catchError(() => of(false))
    );
  }

  loginWithRole(credentials: LoginCredentials, expectedRole: string): Observable<LoginResponse> {
    console.log('Intentando login con rol específico:', expectedRole, 'para:', credentials.email);
    return this.usuarioService.login(credentials).pipe(
      tap(response => {
        console.log('Respuesta de loginWithRole:', response);
        if (response?.usuario && this.isValidUser(response.usuario)) {
          // Verificar que el rol del usuario coincida con el rol esperado
          if (response.usuario.rol !== expectedRole) {
            console.error(`Rol incorrecto. Esperado: ${expectedRole}, Actual: ${response.usuario.rol}`);
            throw new Error(`Rol incorrecto. Se esperaba ${expectedRole} pero el usuario tiene rol ${response.usuario.rol}`);
          }
          this.setAuthData(response);
        } else {
          console.error('Respuesta de login inválida:', response);
          throw new Error('Respuesta de login inválida');
        }
      }),
      catchError(error => {
        console.error('Error de autenticación con rol:', error);
        throw error;
      })
    );
  }

  private setAuthData(response: LoginResponse): void {
    console.log('Estableciendo datos de autenticación para:', response.usuario.email);
    console.log('Rol del usuario:', response.usuario.rol);
    
    // Guardar datos en localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.usuario));
    localStorage.setItem('authToken', response.token || 'logged-in');
    localStorage.setItem('userRole', response.usuario.rol); // Añadido para consistencia
    
    // Actualizar subjects
    this.currentUserSubject.next(response.usuario);
    this.isLoggedInSubject.next(true);
    
    console.log('Datos de auth establecidos correctamente');
    console.log('Estado actual - Logueado:', this.isLoggedIn(), 'Rol:', this.getUserRole());
  }

  updateUserProfile(updatedUser: Usuario): void {
    if (!this.isValidUser(updatedUser)) return;
    
    console.log('Actualizando perfil de usuario:', updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('userRole', updatedUser.rol);
    this.currentUserSubject.next(updatedUser);
  }

  logout(): void {
    console.log('Cerrando sesión');
    this.clearAuthData();
  }

  getCurrentUser(): Usuario | null {
    const user = this.currentUserSubject.value;
    console.log('getCurrentUser() retorna:', user);
    return user;
  }

  getCurrentUserId(): number | null {
    const id = this.getCurrentUser()?.id || null;
    console.log('getCurrentUserId() retorna:', id);
    return id;
  }

  getUserRole(): string | null {
    // Priorizar el rol del usuario actual, fallback a localStorage
    const userRole = this.getCurrentUser()?.rol || localStorage.getItem('userRole');
    console.log('getUserRole() retorna:', userRole);
    return userRole;
  }

  isLoggedIn(): boolean {
    const loggedIn = this.isLoggedInSubject.value;
    console.log('isLoggedIn() retorna:', loggedIn);
    return loggedIn;
  }
  
  hasPermission(requiredRoles: string[]): boolean {
    const userRole = this.getUserRole();
    const hasPermission = !!userRole && requiredRoles.includes(userRole);
    console.log('hasPermission() - Rol del usuario:', userRole, 'Roles requeridos:', requiredRoles, 'Tiene permiso:', hasPermission);
    return hasPermission;
  }

  canAccessUser(targetUserId: number): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      console.log('canAccessUser() - No hay usuario actual');
      return false;
    }
    
    const userRole = this.getUserRole();
    
    if (userRole === 'ADMIN') {
      console.log('canAccessUser() - Usuario es ADMIN, acceso permitido');
      return true;
    }
    
    if (userRole === 'ENTRENADOR') {
      // Lógica para verificar si el usuario es cliente del entrenador
      console.log('canAccessUser() - Usuario es ENTRENADOR, implementar lógica específica');
      return true;
    }
    
    const canAccess = currentUser.id === targetUserId;
    console.log('canAccessUser() - Acceso para usuario:', targetUserId, 'Permitido:', canAccess);
    return canAccess;
  }
}