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
}