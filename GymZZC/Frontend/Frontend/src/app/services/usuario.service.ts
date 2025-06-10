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
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Obtener entrenadores
  getEntrenadores(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/entrenadores`);
  }

  // Crear usuario
  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  // Actualizar usuario
  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
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
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/password`, passwordData);
  }
}