// models/index.ts
export * from './usuario.model';
export * from './ejercicio.model';
export * from './rutina.model';
export * from './progreso.model';
export * from './auth.model';

// Interfaces comunes
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

// Tipos de filtros comunes
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// Estados de carga
export interface LoadingState {
  loading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

// Configuración de la aplicación
export interface AppConfig {
  apiUrl: string;
  tokenExpirationTime: number; // En segundos/minutos
  refreshTokenExpirationTime: number;
  maxFileSize: number; // En bytes
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  defaultPageSize: number;
  maxPageSize: number;
}