// models/progreso.model.ts
import { Usuario } from './usuario.model';
import { Ejercicio } from './ejercicio.model';
import { Rutina } from './rutina.model';
import { TipoEjercicio } from './ejercicio.model';

export interface Progreso {
  id?: number;
  usuario?: Usuario;
  rutina?: Rutina;
  ejercicio?: Ejercicio;
  series: number;
  repeticiones: number;
  pesoUtilizado?: number;
  fechaRegistro?: string; // LocalDate se maneja como string en JSON (YYYY-MM-DD)
  observaciones?: string;
  // Métodos de conveniencia que vienen del backend
  usuarioId?: number;
  usuarioNombre?: string;
  rutinaId?: number;
  ejercicioId?: number;
  ejercicioNombre?: string;
  ejercicioTipo?: TipoEjercicio;
}

// Interface para crear progreso
export interface ProgresoCreacionRequest {
  usuarioId: number;
  rutinaId: number;
  ejercicioId: number;
  series: number;
  repeticiones: number;
  pesoUtilizado?: number;
}

// Interface para filtros de progreso
export interface ProgresoFiltros {
  usuarioId?: number;
  rutinaId?: number;
  ejercicioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

// Interface para estadísticas de progreso
export interface EstadisticasProgreso {
  totalSesiones: number;
  pesoMaximo: number;
  pesoPromedio: number;
  seriesTotal: number;
  repeticionesTotal: number;
  fechaUltimoEntrenamiento?: string;
  progresoPeso: ProgresoPeso[];
}

export interface ProgresoPeso {
  fecha: string;
  peso: number;
  repeticiones: number;
  series: number;
}

// Clase auxiliar para utilidades de progreso
export class ProgresoHelper {
  static crearProgresoBasico(
    usuarioId: number,
    rutinaId: number,
    ejercicioId: number,
    series: number,
    repeticiones: number,
    peso?: number,
  ): ProgresoCreacionRequest {
    return {
      usuarioId,
      rutinaId,
      ejercicioId,
      series,
      repeticiones,
      pesoUtilizado: peso,
    };
  }

  static formatearFecha(fecha?: string): string {
    if (!fecha) return 'No registrada';
    
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  static calcularVolumen(progreso: Progreso): number {
    const peso = progreso.pesoUtilizado || 0;
    return peso * progreso.series * progreso.repeticiones;
  }


  static validarProgreso(progreso: ProgresoCreacionRequest): string[] {
    const errores: string[] = [];

    if (!progreso.usuarioId) {
      errores.push('Usuario es requerido');
    }

    if (!progreso.rutinaId) {
      errores.push('Rutina es requerida');
    }

    if (!progreso.ejercicioId) {
      errores.push('Ejercicio es requerido');
    }

    if (progreso.series <= 0) {
      errores.push('Las series deben ser mayor a 0');
    }

    if (progreso.repeticiones <= 0) {
      errores.push('Las repeticiones deben ser mayor a 0');
    }

    if (progreso.pesoUtilizado && progreso.pesoUtilizado < 0) {
      errores.push('El peso no puede ser negativo');
    }

    return errores;
  }

  static calcularEstadisticas(progresos: Progreso[]): EstadisticasProgreso {
    if (progresos.length === 0) {
      return {
        totalSesiones: 0,
        pesoMaximo: 0,
        pesoPromedio: 0,
        seriesTotal: 0,
        repeticionesTotal: 0,
        progresoPeso: []
      };
    }

    const pesos = progresos.map(p => p.pesoUtilizado || 0);
    const pesoMaximo = Math.max(...pesos);
    const pesoPromedio = pesos.reduce((sum, peso) => sum + peso, 0) / pesos.length;
    const seriesTotal = progresos.reduce((sum, p) => sum + p.series, 0);
    const repeticionesTotal = progresos.reduce((sum, p) => sum + p.repeticiones, 0);

    const progresoPeso = progresos
      .filter(p => p.pesoUtilizado && p.fechaRegistro)
      .map(p => ({
        fecha: p.fechaRegistro!,
        peso: p.pesoUtilizado!,
        repeticiones: p.repeticiones,
        series: p.series
      }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const fechaUltimoEntrenamiento = progresos
      .filter(p => p.fechaRegistro)
      .sort((a, b) => new Date(b.fechaRegistro!).getTime() - new Date(a.fechaRegistro!).getTime())[0]?.fechaRegistro;

    return {
      totalSesiones: progresos.length,
      pesoMaximo,
      pesoPromedio: Math.round(pesoPromedio * 100) / 100,
      seriesTotal,
      repeticionesTotal,
      fechaUltimoEntrenamiento,
      progresoPeso
    };
  }

}