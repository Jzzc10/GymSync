// models/ejercicio.model.ts
export interface Ejercicio {
  id?: number;
  nombre: string;
  tipo: TipoEjercicioEnum;
  descripcion?: string;
  urlImagen?: string;
  urlVideo?: string;
}

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

export class EjercicioHelper {
  static getTiposEjercicio(): TipoEjercicioEnum[] {
    return Object.values(TipoEjercicioEnum);
  }

  static getTipoDisplayName(tipo: TipoEjercicioEnum): string {
    switch (tipo) {
      case TipoEjercicioEnum.PECHO: return 'Pecho';
      case TipoEjercicioEnum.ABDOMINALES: return 'Abdominales';
      case TipoEjercicioEnum.PIERNAS: return 'Piernas';
      case TipoEjercicioEnum.ESPALDA: return 'Espalda';
      case TipoEjercicioEnum.TRICEPS: return 'Tríceps';
      case TipoEjercicioEnum.BICEPS: return 'Bíceps';
      case TipoEjercicioEnum.HOMBRO: return 'Hombro';
      case TipoEjercicioEnum.GLUTEO: return 'Glúteo';
      default: return tipo;
    }
  }

  static getEjerciciosByTipo(ejercicios: Ejercicio[], tipo: TipoEjercicioEnum): Ejercicio[] {
    return ejercicios.filter(ejercicio => ejercicio.tipo === tipo);
  }

  static validateEjercicio(ejercicio: Partial<Ejercicio>): string[] {
    const errors: string[] = [];
    
    if (!ejercicio.nombre || ejercicio.nombre.trim().length === 0) {
      errors.push('El nombre del ejercicio es requerido');
    }
    
    if (!ejercicio.tipo) {
      errors.push('El tipo de ejercicio es requerido');
    }
    
    if (ejercicio.nombre && ejercicio.nombre.length > 100) {
      errors.push('El nombre del ejercicio no puede exceder 100 caracteres');
    }
    
    if (ejercicio.descripcion && ejercicio.descripcion.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }
    
    return errors;
  }
}