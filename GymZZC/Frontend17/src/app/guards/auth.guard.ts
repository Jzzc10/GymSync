import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    console.log('🔒 AuthGuard - Verificando acceso a:', state.url);
    
    // Verificar autenticación básica
    if (!this.authService.isLoggedIn()) {
      console.log('❌ Usuario no autenticado');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Obtener datos del usuario
    const userRole = this.authService.getUserRole();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('👤 Usuario actual:', currentUser?.email);
    console.log('🎭 Rol del usuario:', userRole);
    
    // Verificar que los datos del usuario sean válidos
    if (!userRole || !currentUser) {
      console.error('💥 Datos de usuario inválidos');
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
    
    // Verificar rol requerido
    const requiredRole = route.data?.['role'] as string;
    if (requiredRole) {
      console.log('🎯 Rol requerido:', requiredRole);
      
      if (!this.hasRequiredRole(userRole, requiredRole)) {
        console.log('⛔ Acceso denegado - rol insuficiente');
        // NO redirigir automáticamente, solo negar acceso
        return false;
      }
    }

    console.log('✅ Acceso permitido a:', state.url);
    return true;
  }

  private hasRequiredRole(userRole: string, requiredRole: string): boolean {
    // Verificación exacta de rol (sin reglas complejas para evitar loops)
    if (userRole === requiredRole) {
      return true;
    }
    
    // Solo el admin puede acceder a rutas de admin
    if (requiredRole === 'ADMIN') {
      return userRole === 'ADMIN';
    }
    
    // Para otras rutas, verificación estricta
    return false;
  }
}