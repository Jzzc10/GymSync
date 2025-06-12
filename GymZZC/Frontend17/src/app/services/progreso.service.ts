import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario }from './usuario.service';
import { Ejercicio } from '../models/ejercicio.model';
import { Progreso } from '../models/progreso.model';

export interface Rutina {
  id?: number;
  descripcion?: string;
  // Otras propiedades necesarias para la referencia
}

@Injectable({
  providedIn: 'root'
})
export class ProgresoService {
  private apiUrl = `${environment.apiUrl}/api/progresos`;

  constructor(private http: HttpClient) {}

  // Obtener todos los progresos
  getProgresos(): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(this.apiUrl);
  }

  // Obtener progreso por ID
  getProgresoById(id: number): Observable<Progreso> {
    return this.http.get<Progreso>(`${this.apiUrl}/${id}`);
  }

  // Obtener progresos de un usuario
  getProgresosByUsuario(usuarioId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Obtener progresos de un usuario en una rutina específica
  getProgresosByUsuarioAndRutina(usuarioId: number, rutinaId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario/${usuarioId}/rutina/${rutinaId}`);
  }

  // Obtener progresos de un usuario en un ejercicio específico
  getProgresosByUsuarioAndEjercicio(usuarioId: number, ejercicioId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/usuario/${usuarioId}/ejercicio/${ejercicioId}`);
  }

  // Obtener progresos específicos de usuario, rutina y ejercicio
  getProgresosEspecificos(
    usuarioId: number, 
    rutinaId: number, 
    ejercicioId: number
  ): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(
      `${this.apiUrl}/usuario/${usuarioId}/rutina/${rutinaId}/ejercicio/${ejercicioId}`
    );
  }

  getResumenProgreso(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen/${usuarioId}`);
  }

  
  // Registrar progreso
  registrarProgreso(progreso: Progreso): Observable<Progreso> {
    return this.http.post<Progreso>(this.apiUrl, progreso);
  }

  // Actualizar progreso
  updateProgreso(id: number, progreso: Progreso): Observable<Progreso> {
    return this.http.put<Progreso>(`${this.apiUrl}/${id}`, progreso);
  }

  // Eliminar progreso
  deleteProgreso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método auxiliar para crear un progreso básico
  crearProgresoBasico(
    usuarioId: number,
    rutinaId: number,
    ejercicioId: number,
    series: number,
    repeticiones: number,
    peso?: number,
    observaciones?: string
  ): Progreso {
    return {
      usuario: { id: usuarioId } as Usuario,
      rutina: { id: rutinaId } as Rutina,
      ejercicio: { id: ejercicioId } as Ejercicio,
      series,
      repeticiones,
      pesoUtilizado: peso,
      observaciones,
      fechaRegistro: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    };
  }
}

export { Progreso };
