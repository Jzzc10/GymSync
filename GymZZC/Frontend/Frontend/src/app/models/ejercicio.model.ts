// models/ejercicio.model.ts

export interface Ejercicio {
  id?: number;
  nombre: string;
  tipo: TipoEjercicio;
  descripcion?: string;
  urlImagen?: string;
  urlVideo?: string;
}

export type TipoEjercicio = 
  | 'PECHO' 
  | 'ABDOMINALES' 
  | 'PIERNAS' 
  | 'ESPALDA' 
  | 'TRICEPS' 
  | 'BICEPS' 
  | 'HOMBRO' 
  | 'GLUTEO';

// Enum para los tipos de ejercicio
export enum TipoEjercicioEnum {
  PECHO = 'PECHO',
  ABDOMINALES = 'ABDOMINALES',
  PIERNAS = 'PIERNAS',
  ESPALDA = 'ESPALDA',
  TRICEPS = 'TRICEPS',
  BICEPS = 'BICEPS',
  HOMBRO = 'HOMBRO',
  GLUTEO = 'GLUTEO'
}

// Clase auxiliar para utilidades de ejercicios
export class EjercicioHelper {
  static getTiposEjercicio(): TipoEjercicio[] {
    return Object.values(TipoEjercicioEnum);
  }

  static getTipoDisplayName(tipo: TipoEjercicio): string {
    switch (tipo) {
      case TipoEjercicioEnum.PECHO:
        return 'Pecho';
      case TipoEjercicioEnum.ABDOMINALES:
        return 'Abdominales';
      case TipoEjercicioEnum.PIERNAS:
        return 'Piernas';
      case TipoEjercicioEnum.ESPALDA:
        return 'Espalda';
      case TipoEjercicioEnum.TRICEPS:
        return 'Tríceps';
      case TipoEjercicioEnum.BICEPS:
        return 'Bíceps';
      case TipoEjercicioEnum.HOMBRO:
        return 'Hombro';
      case TipoEjercicioEnum.GLUTEO:
        return 'Glúteo';
      default:
        return tipo;
    }
  }

  static isValidTipo(tipo: string): boolean {
    return Object.values(TipoEjercicioEnum).includes(tipo as TipoEjercicioEnum);
  }

  static getIconoTipo(tipo: TipoEjercicio): string {
    switch (tipo) {
      case TipoEjercicioEnum.PECHO:
        return '💪';
      case TipoEjercicioEnum.ABDOMINALES:
        return '🏋️';
      case TipoEjercicioEnum.PIERNAS:
        return '🦵';
      case TipoEjercicioEnum.ESPALDA:
        return '🏃';
      case TipoEjercicioEnum.TRICEPS:
        return '💪';
      case TipoEjercicioEnum.BICEPS:
        return '💪';
      case TipoEjercicioEnum.HOMBRO:
        return '🤸';
      case TipoEjercicioEnum.GLUTEO:
        return '🍑';
      default:
        return '🏋️';
    }
  }
}