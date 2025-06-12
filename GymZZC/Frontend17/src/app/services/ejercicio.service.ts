// services/ejercicio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Importar desde el modelo
import { Ejercicio, TipoEjercicioEnum, EjercicioHelper } from '../models/ejercicio.model';

@Injectable({
  providedIn: 'root'
})
export class EjercicioService {
  private readonly apiUrl = `${environment.apiUrl}/api/ejercicios`;

  constructor(private http: HttpClient) {}

  // Obtener todos los ejercicios
  getEjercicios(): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Obtener ejercicio por ID
  getEjercicioById(id: number): Observable<Ejercicio> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de ejercicio inválido'));
    }

    return this.http.get<Ejercicio>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Obtener ejercicios por tipo
  getEjerciciosByTipo(tipo: TipoEjercicioEnum): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(`${this.apiUrl}/tipo/${tipo}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Crear ejercicio
  createEjercicio(ejercicio: Ejercicio): Observable<Ejercicio> {
    // Validar antes de enviar
    const validationErrors = EjercicioHelper.validateEjercicio(ejercicio);
    if (validationErrors.length > 0) {
      return throwError(() => new Error(`Errores de validación: ${validationErrors.join(', ')}`));
    }

    return this.http.post<Ejercicio>(this.apiUrl, ejercicio)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar ejercicio
  updateEjercicio(id: number, ejercicio: Ejercicio): Observable<Ejercicio> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de ejercicio inválido'));
    }

    // Validar antes de enviar
    const validationErrors = EjercicioHelper.validateEjercicio(ejercicio);
    if (validationErrors.length > 0) {
      return throwError(() => new Error(`Errores de validación: ${validationErrors.join(', ')}`));
    }

    return this.http.put<Ejercicio>(`${this.apiUrl}/${id}`, ejercicio)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar ejercicio
  deleteEjercicio(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de ejercicio inválido'));
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Buscar ejercicios por nombre
  searchEjercicios(nombre: string): Observable<Ejercicio[]> {
    if (!nombre || nombre.trim().length === 0) {
      return this.getEjercicios();
    }

    return this.http.get<Ejercicio[]>(`${this.apiUrl}/search?nombre=${encodeURIComponent(nombre.trim())}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  

  // Métodos auxiliares que delegan a EjercicioHelper
  getTiposEjercicio(): TipoEjercicioEnum[] {
    return Object.values(TipoEjercicioEnum);
  }
  

  getTipoDisplayName(tipo: TipoEjercicioEnum): string {
    return EjercicioHelper.getTipoDisplayName(tipo);
  }


  validateEjercicio(ejercicio: Partial<Ejercicio>): string[] {
    return EjercicioHelper.validateEjercicio(ejercicio);
  }

  getEjerciciosByTipoFromArray(ejercicios: Ejercicio[], tipo: TipoEjercicioEnum): Ejercicio[] {
    return EjercicioHelper.getEjerciciosByTipo(ejercicios, tipo);
  }

  // Manejo de errores
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida. Verifica los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'Ejercicio no encontrado.';
          break;
        case 409:
          errorMessage = 'Ya existe un ejercicio con ese nombre.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}`;
      }
      
      if (error.error && error.error.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    console.error('Error en EjercicioService:', error);
    return throwError(() => new Error(errorMessage));
  };
}