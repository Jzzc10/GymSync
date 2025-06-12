import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Permission } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard ejecutándose para ruta:', state.url);
    
    const requiredPermissions = route.data['requiredPermissions'] as Permission[];
    const requiredRole = route.data?.['role'] as string;
    
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      console.log('Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url },
        replaceUrl: true // Reemplazar la URL actual en el historial
      });
      return false;
    }

    // Obtener datos del usuario
    const userRole = this.authService.getUserRole();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('Usuario logueado:', !!currentUser);
    console.log('Rol del usuario:', userRole);
    console.log('Rol requerido:', requiredRole);
    
    // Verificar que los datos del usuario sean válidos
    if (!userRole || !currentUser) {
      console.error('Datos de usuario inválidos, limpiando sesión');
      this.authService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    
    // Verificar rol requerido
    if (requiredRole && !this.hasRequiredRole(userRole, requiredRole)) {
      console.log('Rol insuficiente, redirigiendo al dashboard apropiado');
      this.redirectToUserDashboard(userRole);
      return false;
    }

    // Verificar permisos requeridos
    if (requiredPermissions && requiredPermissions.length > 0) {
      for (const perm of requiredPermissions) {
        if (!this.authService.hasPermission([perm as unknown as string])) {
          console.log('Permisos insuficientes para:', perm);
          this.redirectToUserDashboard(userRole);
          return false;
        }
      }
    }

    console.log('Acceso permitido a:', state.url);
    return true;
  }

  private hasRequiredRole(userRole: string | null, requiredRole: string): boolean {
    if (!userRole) {
      console.log('No hay rol de usuario');
      return false;
    }
    
    // El admin puede acceder a todo
    if (userRole === 'ADMIN') {
      console.log('Usuario es ADMIN, acceso permitido');
      return true;
    }
    
    // El entrenador puede acceder a rutas de entrenador y cliente
    if (userRole === 'ENTRENADOR' && (requiredRole === 'ENTRENADOR' || requiredRole === 'CLIENTE')) {
      console.log('Usuario es ENTRENADOR, acceso permitido a:', requiredRole);
      return true;
    }
    
    // Verificación exacta de rol
    const hasRole = userRole === requiredRole;
    console.log('Verificación exacta de rol:', hasRole);
    return hasRole;
  }

  private redirectToUserDashboard(userRole: string | null): void {
    if (!userRole) {
      console.log('Sin rol, redirigiendo a login');
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    
    console.log('Redirigiendo según rol:', userRole);
    
    // Usar replaceUrl para evitar bucles de navegación
    switch (userRole) {
      case 'ADMIN': 
        this.router.navigate(['/dashboard-admin'], { replaceUrl: true }); 
        break;
      case 'ENTRENADOR': 
        this.router.navigate(['/dashboard-entrenador'], { replaceUrl: true }); 
        break;
      case 'CLIENTE': 
        this.router.navigate(['/dashboard-cliente'], { replaceUrl: true }); 
        break;
      default: 
        console.log('Rol desconocido:', userRole);
        this.authService.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}