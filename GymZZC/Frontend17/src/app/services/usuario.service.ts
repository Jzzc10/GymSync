import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'CLIENTE' | 'ENTRENADOR' | 'ADMIN';
  entrenadorId?: number; // ID del entrenador asignado (para clientes)
  entrenadorNombre?: string; // Nombre del entrenador (campo auxiliar)
  fechaRegistro?: string;
  activo?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;
  rol: string;
  token?: string; // Para JWT si lo implementas
}

export interface PasswordChangeRequest {
  currentPassword: string;
  nuevaPassword: string;
}

export interface AsignarEntrenadorRequest {
  clienteId: number;
  entrenadorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios con filtros opcionales
  getUsuarios(filtros?: { nombre?: string; rol?: string; email?: string }): Observable<Usuario[]> {
    let params = new HttpParams();
    
    if (filtros?.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros?.rol) {
      params = params.set('rol', filtros.rol);
    }
    if (filtros?.email) {
      params = params.set('email', filtros.email);
    }

    return this.http.get<Usuario[]>(this.apiUrl, { params });
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener entrenadores
  getEntrenadores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/entrenadores`);
  }

  // Obtener clientes
  getClientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/clientes`);
  }

  // NUEVOS MÉTODOS PARA ENTRENADORES

  // Obtener clientes asignados al entrenador logueado (usando token)
  getMisClientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/mis-clientes`);
  }

  // Asignar un cliente a un entrenador (solo admin)
  asignarEntrenador(usuarioId: number, entrenadorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${usuarioId}/asignar-entrenador`, { entrenadorId });
  }

  // Desasignar un cliente de su entrenador (solo admin)
  desasignarEntrenador(clienteId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/cliente/${clienteId}/entrenador`);
  }

  // Obtener el entrenador asignado a un cliente
  getEntrenadorAsignado(clienteId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/cliente/${clienteId}/entrenador`);
  }

  // Obtener clientes sin entrenador asignado (solo admin)
  getClientesSinEntrenador(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/clientes-sin-entrenador`);
  }

  // MÉTODOS EXISTENTES

  // Crear usuario
  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  getClientesAsignados(entrenadorId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/entrenador/${entrenadorId}/clientes`);
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Login
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Cambiar contraseña
  cambiarPassword(id: number, passwordData: PasswordChangeRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${id}/password`, 
      passwordData
    );
  }

  

  

  // Activar/Desactivar usuario
  toggleUsuarioActivo(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/toggle-activo`, {});
  }

  // Obtener perfil del usuario actual
  getMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/mi-perfil`);
  }

  // Actualizar mi perfil
  actualizarMiPerfil(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/mi-perfil`, usuario);
  }

  // Métodos auxiliares para el frontend
  
  // Verificar si un usuario puede ser entrenador
  puedeSerEntrenador(usuario: Usuario): boolean {
    return usuario.rol === 'ENTRENADOR' || usuario.rol === 'ADMIN';
  }

  // Verificar si un usuario puede asignar entrenadores
  puedeAsignarEntrenadores(usuario: Usuario): boolean {
    return usuario.rol === 'ADMIN';
  }

  // Obtener nombre de rol para mostrar
  getNombreRol(rol: string): string {
    switch (rol) {
      case 'CLIENTE':
        return 'Cliente';
      case 'ENTRENADOR':
        return 'Entrenador';
      case 'ADMIN':
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }

  // Validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}