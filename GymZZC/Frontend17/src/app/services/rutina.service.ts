import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from './usuario.service';
import { Progreso } from './progreso.service';

export interface RutinaEjercicio {
  rutina?: Rutina;
  ejercicio?: any; // Referencia al ejercicio
  series: number;
  repeticiones: number;
  pesoEjercicio?: number;
  // Métodos de conveniencia que vienen del backend
  rutinaId?: number;
  ejercicioId?: number;
  ejercicioNombre?: string;
  ejercicioTipo?: string;
}

export interface Rutina {
  id?: number;
  cliente?: Usuario;
  entrenador?: Usuario;
  descripcion?: string;
  ejercicios?: RutinaEjercicio[];
  progresos?: Progreso[];
  fechaCreacion?: string;
  fechaModificacion?: string;
  activa?: boolean;
  // Métodos de conveniencia que vienen del backend
  clienteId?: number;
  clienteNombre?: string;
  entrenadorId?: number;
  entrenadorNombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  private apiUrl = `${environment.apiUrl}/api/rutinas`;

  constructor(private http: HttpClient) {}

  // Obtener todas las rutinas
  getRutinas(): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(this.apiUrl);
  }

  // Obtener rutina por ID
  getRutinaById(id: number): Observable<Rutina> {
    return this.http.get<Rutina>(`${this.apiUrl}/${id}`);
  }

  // Obtener rutinas por cliente
  getRutinasByCliente(clienteId: number): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Obtener rutinas por entrenador
  getRutinasByEntrenador(entrenadorId: number): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${this.apiUrl}/entrenador/${entrenadorId}`);
  }

  // Obtener todos los progresos de una rutina
  getProgresosByRutina(rutinaId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/${rutinaId}/progresos`);
  }

  // Obtener progresos de una rutina por usuario
  getProgresosByRutinaAndUsuario(rutinaId: number, usuarioId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/${rutinaId}/progresos/usuario/${usuarioId}`);
  }

  // Obtener progresos de una rutina por ejercicio
  getProgresosByRutinaAndEjercicio(rutinaId: number, ejercicioId: number): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(`${this.apiUrl}/${rutinaId}/progresos/ejercicio/${ejercicioId}`);
  }

  // Obtener progresos específicos de usuario y ejercicio en una rutina
  getProgresosByRutinaUsuarioAndEjercicio(
    rutinaId: number, 
    usuarioId: number, 
    ejercicioId: number
  ): Observable<Progreso[]> {
    return this.http.get<Progreso[]>(
      `${this.apiUrl}/${rutinaId}/progresos/usuario/${usuarioId}/ejercicio/${ejercicioId}`
    );
  }

  // Crear rutina
  createRutina(rutina: Rutina): Observable<Rutina> {
    return this.http.post<Rutina>(this.apiUrl, rutina);
  }

  // Actualizar rutina
  updateRutina(id: number, rutina: Rutina): Observable<Rutina> {
    return this.http.put<Rutina>(`${this.apiUrl}/${id}`, rutina);
  }

  // Eliminar rutina
  deleteRutina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // MÉTODO FALTANTE - Asignar rutina a cliente
  asignarRutinaACliente(rutinaId: number, clienteId: number): Observable<Rutina> {
    return this.http.put<Rutina>(`${this.apiUrl}/${rutinaId}/asignar-cliente/${clienteId}`, {});
  }

  // MÉTODOS PARA GESTIÓN DE EJERCICIOS EN RUTINAS

  // Obtener ejercicios de una rutina
  getEjerciciosDeRutina(rutinaId: number): Observable<RutinaEjercicio[]> {
    return this.http.get<RutinaEjercicio[]>(`${this.apiUrl}/${rutinaId}/ejercicios`);
  }

  // Obtener ejercicio específico en una rutina
  getEjercicioEnRutina(rutinaId: number, ejercicioId: number): Observable<RutinaEjercicio> {
    return this.http.get<RutinaEjercicio>(`${this.apiUrl}/${rutinaId}/ejercicios/${ejercicioId}`);
  }

  // Agregar ejercicio a rutina
  agregarEjercicioARutina(rutinaId: number, rutinaEjercicio: RutinaEjercicio): Observable<RutinaEjercicio> {
    return this.http.post<RutinaEjercicio>(`${this.apiUrl}/${rutinaId}/ejercicios`, rutinaEjercicio);
  }

  // Actualizar ejercicio en rutina
  actualizarEjercicioEnRutina(
    rutinaId: number, 
    ejercicioId: number, 
    rutinaEjercicio: RutinaEjercicio
  ): Observable<RutinaEjercicio> {
    return this.http.put<RutinaEjercicio>(
      `${this.apiUrl}/${rutinaId}/ejercicios/${ejercicioId}`, 
      rutinaEjercicio
    );
  }

  // Quitar ejercicio de rutina
  quitarEjercicioDeRutina(rutinaId: number, ejercicioId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${rutinaId}/ejercicios/${ejercicioId}`);
  }
}