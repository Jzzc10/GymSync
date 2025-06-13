// src/app/models/auth.model.ts
import { Usuario } from './usuario.model';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Usuario | null;
  token: string | null;
  tokenExpiration?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  usuario: Usuario;
  rol: string;
  token: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol?: 'CLIENTE' | 'ENTRENADOR';
  fechaNacimiento?: string;
  telefono?: string;
  terminos: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Permisos básicos
export enum Permission {
  VIEW_USERS = 'users:read',
  EDIT_USER = 'users:update',
  DELETE_USER = 'users:delete',
  
  VIEW_EXERCISES = 'exercises:read',
  CREATE_EXERCISE = 'exercises:create',
  EDIT_EXERCISE = 'exercises:update',
  DELETE_EXERCISE = 'exercises:delete',
  
  VIEW_ROUTINES = 'routines:read',
  CREATE_ROUTINE = 'routines:create',
  ASSIGN_ROUTINE = 'routines:assign',
  DELETE_ROUTINE = 'routines:delete',
  EDIT_ROUTINE = 'routines:update',
  
  VIEW_PROGRESS = 'progress:read',
  CREATE_PROGRESS = 'progress:create',
  
  ADMIN_PANEL = 'admin:panel'
}

// Mapeo simplificado de roles
export const RolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    Permission.VIEW_USERS, Permission.EDIT_USER, Permission.DELETE_USER,
    Permission.ADMIN_PANEL
  ],
  
  ENTRENADOR: [
    Permission.VIEW_USERS,
    Permission.VIEW_EXERCISES, Permission.CREATE_EXERCISE, Permission.EDIT_EXERCISE, Permission.DELETE_EXERCISE,
    Permission.VIEW_ROUTINES, Permission.CREATE_ROUTINE, Permission.ASSIGN_ROUTINE, Permission.DELETE_ROUTINE, Permission.EDIT_ROUTINE,
    Permission.VIEW_PROGRESS
  ],
  
  CLIENTE: [
    Permission.VIEW_EXERCISES,
    Permission.VIEW_ROUTINES,
    Permission.VIEW_PROGRESS, Permission.CREATE_PROGRESS
  ]
};

export class AuthHelper {
  static hasPermission(userRole: string, permission: Permission): boolean {
    const rolePermissions = RolePermissions[userRole] || [];
    return rolePermissions.includes(permission);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static clearAuthStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
  }
}