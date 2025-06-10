// models/usuario.model.ts

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'CLIENTE' | 'ENTRENADOR' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;
  rol: string;
}

export interface PasswordChangeRequest {
  nuevaPassword: string;
}

export interface UsuarioFiltros {
  nombre?: string;
  rol?: string;
  email?: string;
}

// Enum para los roles de usuario
export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  ENTRENADOR = 'ENTRENADOR',
  ADMIN = 'ADMIN'
}

// Clase auxiliar para validaciones y utilidades
export class UsuarioHelper {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidRole(rol: string): boolean {
    return Object.values(RolUsuario).includes(rol as RolUsuario);
  }

  static getRoleDisplayName(rol: string): string {
    switch (rol) {
      case RolUsuario.CLIENTE:
        return 'Cliente';
      case RolUsuario.ENTRENADOR:
        return 'Entrenador';
      case RolUsuario.ADMIN:
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }
}