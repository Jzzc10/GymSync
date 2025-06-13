// src/app/pipes/madridTime.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'madridTime' })
export class MadridTimePipe implements PipeTransform {
  transform(value: any): string | null {
    if (!value) return null;
    
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return null;
    }
  }
}