import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

// Interfaz para el usuario almacenado en localStorage
interface UsuarioAlmacenado {
  id: number;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'ENTRENADOR' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificar si hay un usuario logueado
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const usuario: UsuarioAlmacenado = JSON.parse(usuarioStr);
      
      // Verificar que el usuario tenga los datos necesarios
      if (!usuario.id || !usuario.rol) {
        this.router.navigate(['/login']);
        return false;
      }

      // Verificar roles específicos si están definidos en la ruta
      const rolesPermitidos = route.data?.['roles'] as string[];
      if (rolesPermitidos && rolesPermitidos.length > 0) {
        if (!rolesPermitidos.includes(usuario.rol)) {
          // Redirigir según el rol del usuario
          this.redirigirSegunRol(usuario.rol);
          return false;
        }
      }

      return true;

    } catch (error) {
      console.error('Error al parsear usuario del localStorage:', error);
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
      return false;
    }
  }

  private redirigirSegunRol(rol: string): void {
    switch (rol) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'ENTRENADOR':
        this.router.navigate(['/entrenador']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/cliente']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class EntrenadorGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const usuario: UsuarioAlmacenado = JSON.parse(usuarioStr);
      
      // Solo ENTRENADOR y ADMIN pueden acceder a rutas de entrenador
      if (usuario.rol === 'ENTRENADOR' || usuario.rol === 'ADMIN') {
        return true;
      }

      // Si es cliente, redirigir a su dashboard
      if (usuario.rol === 'CLIENTE') {
        this.router.navigate(['/cliente']);
      } else {
        this.router.navigate(['/login']);
      }
      
      return false;

    } catch (error) {
      console.error('Error al verificar permisos de entrenador:', error);
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const usuario: UsuarioAlmacenado = JSON.parse(usuarioStr);
      
      // Solo CLIENTE puede acceder a rutas de cliente
      if (usuario.rol === 'CLIENTE') {
        return true;
      }

      // Redirigir según el rol
      if (usuario.rol === 'ENTRENADOR') {
        this.router.navigate(['/entrenador']);
      } else if (usuario.rol === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/login']);
      }
      
      return false;

    } catch (error) {
      console.error('Error al verificar permisos de cliente:', error);
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const usuario: UsuarioAlmacenado = JSON.parse(usuarioStr);
      
      // Solo ADMIN puede acceder a rutas de administrador
      if (usuario.rol === 'ADMIN') {
        return true;
      }

      // Redirigir según el rol
      if (usuario.rol === 'ENTRENADOR') {
        this.router.navigate(['/entrenador']);
      } else if (usuario.rol === 'CLIENTE') {
        this.router.navigate(['/cliente']);
      } else {
        this.router.navigate(['/login']);
      }
      
      return false;

    } catch (error) {
      console.error('Error al verificar permisos de administrador:', error);
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// Servicio auxiliar para obtener información del usuario logueado
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  getUsuarioActual(): UsuarioAlmacenado | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return null;

    try {
      return JSON.parse(usuarioStr);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getUsuarioActual() !== null;
  }

  isEntrenador(): boolean {
    const usuario = this.getUsuarioActual();
    return usuario?.rol === 'ENTRENADOR' || usuario?.rol === 'ADMIN';
  }

  isCliente(): boolean {
    const usuario = this.getUsuarioActual();
    return usuario?.rol === 'CLIENTE';
  }

  isAdmin(): boolean {
    const usuario = this.getUsuarioActual();
    return usuario?.rol === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token'); // Si usas tokens
  }
}