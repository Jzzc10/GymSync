// models/rutina.model.ts

import { Usuario } from './usuario.model';
import { Ejercicio } from './ejercicio.model';
import { Progreso } from './progreso.model';

export interface RutinaEjercicio {
  rutina?: Rutina;
  ejercicio?: Ejercicio;
  series: number | null; 
  repeticiones: number | null; 
  pesoEjercicio?: number; // Opcional, puede ser null si no aplica
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

// Interface para crear una rutina simplificada
export interface RutinaCreacionRequest {
  clienteId: number;
  entrenadorId: number;
  descripcion: string;
  ejercicios: RutinaEjercicioRequest[];
}

export interface RutinaEjercicioRequest {
  ejercicioId: number;
  series: number | null;
  repeticiones: number | null;
  pesoEjercicio?: number | null;
}
// Interface para actualizar rutina
export interface RutinaActualizacionRequest {
  descripcion?: string;
  activa?: boolean;
  ejercicios?: RutinaEjercicioRequest[];
}

// Clase auxiliar para utilidades de rutinas
export class RutinaHelper {
  static crearRutinaBasica(
    clienteId: number,
    entrenadorId: number,
    descripcion: string
  ): RutinaCreacionRequest {
    return {
      clienteId,
      entrenadorId,
      descripcion,
      ejercicios: []
    };
  }

  static crearEjercicioRutina(
    ejercicioId: number,
    series: number,
    repeticiones: number,
    peso?: number
  ): RutinaEjercicioRequest {
    return {
      ejercicioId,
      series,
      repeticiones,
      pesoEjercicio: peso
    };
  }

  static calcularTotalEjercicios(rutina: Rutina): number {
    return rutina.ejercicios?.length || 0;
  }

  static calcularTotalSeries(rutina: Rutina): number {
    return rutina.ejercicios?.reduce((total, ejercicio) => {
      return total + (ejercicio.series ?? 0); // Si es null, suma 0
    }, 0) || 0;
  }

  static obtenerTiposEjerciciosEnRutina(rutina: Rutina): string[] {
    const tipos = new Set<string>();
    rutina.ejercicios?.forEach(ejercicio => {
      if (ejercicio.ejercicioTipo) {
        tipos.add(ejercicio.ejercicioTipo);
      }
    });
    return Array.from(tipos);
  }

  static formatearDescripcion(descripcion?: string): string {
    if (!descripcion) return 'Sin descripción';
    return descripcion.length > 100 
      ? descripcion.substring(0, 100) + '...' 
      : descripcion;
  }

  static validarRutina(rutina: RutinaCreacionRequest): string[] {
    const errores: string[] = [];

    if (!rutina.clienteId) {
      errores.push('Debe seleccionar un cliente');
    }

    if (!rutina.entrenadorId) {
      errores.push('Debe seleccionar un entrenador');
    }

    if (!rutina.descripcion?.trim()) {
      errores.push('La descripción es obligatoria');
    }

    if (!rutina.ejercicios || rutina.ejercicios.length === 0) {
      errores.push('Debe agregar al menos un ejercicio');
    }

    rutina.ejercicios?.forEach((ejercicio, index) => {
      if (ejercicio.series === null || ejercicio.series <= 0) {
        errores.push(`El ejercicio ${index + 1} debe tener al menos 1 serie`);
      }
      if (ejercicio.repeticiones === null || ejercicio.repeticiones <= 0) {
        errores.push(`El ejercicio ${index + 1} debe tener al menos 1 repetición`);
      }
    });


    return errores;
  }
}