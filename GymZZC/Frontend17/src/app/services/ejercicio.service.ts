import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ejercicio {
  id?: number;
  nombre: string;
  tipo: 'PECHO' | 'ABDOMINALES' | 'PIERNAS' | 'ESPALDA' | 'TRICEPS' | 'BICEPS' | 'HOMBRO' | 'GLUTEO';
  descripcion?: string;
  urlImagen?: string;
  urlVideo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  private apiUrl = `${environment.apiUrl}/api/ejercicios`;

  constructor(private http: HttpClient) {}

  // Obtener todos los ejercicios
  getEjercicios(): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(this.apiUrl);
  }

  // Obtener ejercicio por ID
  getEjercicioById(id: number): Observable<Ejercicio> {
    return this.http.get<Ejercicio>(`${this.apiUrl}/${id}`);
  }

  // Crear ejercicio
  createEjercicio(ejercicio: Ejercicio): Observable<Ejercicio> {
    return this.http.post<Ejercicio>(this.apiUrl, ejercicio);
  }

  // Actualizar ejercicio
  updateEjercicio(id: number, ejercicio: Ejercicio): Observable<Ejercicio> {
    return this.http.put<Ejercicio>(`${this.apiUrl}/${id}`, ejercicio);
  }

  // Eliminar ejercicio
  deleteEjercicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método auxiliar para obtener los tipos de ejercicio
  getTiposEjercicio(): string[] {
    return ['PECHO', 'ABDOMINALES', 'PIERNAS', 'ESPALDA', 'TRICEPS', 'BICEPS', 'HOMBRO', 'GLUTEO'];
  }
}