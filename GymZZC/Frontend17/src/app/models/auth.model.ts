// models/auth.model.ts

import { Usuario } from './usuario.model';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Usuario | null;
  token: string | null;
  refreshToken?: string | null;
  tokenExpiration?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;
  rol: string;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol?: 'CLIENTE' | 'ENTRENADOR';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Permisos del sistema
export enum Permission {
  // Usuarios
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  
  // Ejercicios
  VIEW_EXERCISES = 'VIEW_EXERCISES',
  CREATE_EXERCISE = 'CREATE_EXERCISE',
  EDIT_EXERCISE = 'EDIT_EXERCISE',
  DELETE_EXERCISE = 'DELETE_EXERCISE',
  
  // Rutinas
  VIEW_ROUTINES = 'VIEW_ROUTINES',
  CREATE_ROUTINE = 'CREATE_ROUTINE',
  EDIT_ROUTINE = 'EDIT_ROUTINE',
  DELETE_ROUTINE = 'DELETE_ROUTINE',
  ASSIGN_ROUTINE = 'ASSIGN_ROUTINE',
  
  // Progreso
  VIEW_PROGRESS = 'VIEW_PROGRESS',
  CREATE_PROGRESS = 'CREATE_PROGRESS',
  EDIT_PROGRESS = 'EDIT_PROGRESS',
  DELETE_PROGRESS = 'DELETE_PROGRESS',
  VIEW_ALL_PROGRESS = 'VIEW_ALL_PROGRESS',
  
  // Administración
  ADMIN_PANEL = 'ADMIN_PANEL',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG'
}

// Mapeo de roles a permisos
export const RolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    
    Permission.ADMIN_PANEL,
    Permission.SYSTEM_CONFIG
  ],
  ENTRENADOR: [
    Permission.VIEW_USERS, // Solo clientes asignados
    Permission.VIEW_EXERCISES,
    Permission.CREATE_EXERCISE,
    Permission.EDIT_EXERCISE,
    Permission.VIEW_ROUTINES,
    Permission.CREATE_ROUTINE,
    Permission.EDIT_ROUTINE,
    Permission.DELETE_ROUTINE,
    Permission.ASSIGN_ROUTINE,
    Permission.VIEW_PROGRESS, // Solo el de clientes asignados
  ],
  CLIENTE: [
    Permission.VIEW_EXERCISES,
    Permission.VIEW_ROUTINES, // Solo las propias
    Permission.VIEW_PROGRESS, // Solo el propio
    Permission.CREATE_PROGRESS
  ]
};

// Clase auxiliar para gestión de autenticación
export class AuthHelper {
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  static getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  static hasPermission(userRole: string, permission: Permission): boolean {
    const rolePermissions = RolePermissions[userRole] || [];
    return rolePermissions.includes(permission);
  }

  static hasAnyPermission(userRole: string, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  static hasAllPermissions(userRole: string, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  static canAccessUser(currentUser: Usuario, targetUserId: number): boolean {
    if (!currentUser) return false;

    // Admin puede acceder a cualquier usuario
    if (currentUser.rol === 'ADMIN') return true;

    // Entrenador puede acceder a sus clientes (requiere lógica adicional del backend)
    if (currentUser.rol === 'ENTRENADOR') return true;

    // Cliente solo puede acceder a sus propios datos
    return currentUser.id === targetUserId;
  }

  static validatePassword(password: string, strict: boolean = true): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (strict) {
      if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una mayúscula');
      }

      if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una minúscula');
      }

      if (!/\d/.test(password)) {
        errors.push('La contraseña debe contener al menos un número');
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('La contraseña debe contener al menos un carácter especial');
      }
    }

    return errors;
  }

  // Método para validar consistencia de datos
  static validateUserConsistency(usuario: Usuario): string[] {
    const errors: string[] = [];

    if (!usuario.nombre?.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!this.validateEmail(usuario.email)) {
      errors.push('El email no tiene un formato válido');
    }

    if (!this.isValidRole(usuario.rol)) {
      errors.push('El rol no es válido');
    }

    return errors;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Completar con caracteres aleatorios
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Mezclar los caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  static getStorageKey(key: string): string {
    return `gymapp_${key}`;
  }

  static clearAuthStorage(): void {
    const keys = ['currentUser', 'authToken', 'userRole', 'refreshToken'];
    keys.forEach(key => {
      localStorage.removeItem(this.getStorageKey(key));
      sessionStorage.removeItem(this.getStorageKey(key));
    });
  }

  private static isValidRole(rol: string): boolean {
    return ['CLIENTE', 'ENTRENADOR', 'ADMIN'].includes(rol);
  }
}