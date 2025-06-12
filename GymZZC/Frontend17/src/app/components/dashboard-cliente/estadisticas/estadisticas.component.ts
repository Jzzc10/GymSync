// estadisticas.component.ts
import { ProgresoService } from '../../../services/progreso.service';
import { RutinaService } from '../../../services/rutina.service';
import { EjercicioService } from '../../../services/ejercicio.service';
import { AuthService } from '../../../services/auth.service';
import { ProgresoHelper } from '../../../models/progreso.model';
import { DatePipe } from '@angular/common';
import { OrderByPipe } from '../../../pipes/order-by.pipe';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Rutina } from '../../../services/rutina.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  providers: [DatePipe] // DatePipe para formateo de fechas
})

export class EstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChild('pesoChart') pesoChart!: ElementRef<HTMLCanvasElement>;
  private chartContext: CanvasRenderingContext2D | null = null;

  ejerciciosPorRutina: Map<number, any[]> = new Map();
  ejerciciosFiltrados: any[] = [];
  
  // Datos
  progresos: any[] = [];
  rutinas: Rutina[] = [];
  ejercicios: any[] = [];
  estadisticas: any = {};
  loading = true;
  error: string | null = null;

  // Filtros
  filtros = {
    rutinaId: null as number | null,
    ejercicioId: null as number | null,
    fechaDesde: null as string | null,
    fechaHasta: null as string | null
  };

  constructor(
    private progresoService: ProgresoService,
    private rutinaService: RutinaService,
    private ejercicioService: EjercicioService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}
  
  ngAfterViewInit(): void {
    if (this.pesoChart) {
      this.chartContext = this.pesoChart.nativeElement.getContext('2d');
      this.dibujarGrafico();
    }
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    const usuarioId = this.authService.getCurrentUserId();
    if (!usuarioId) {
      this.error = 'Usuario no autenticado';
      this.loading = false;
      return;
    }

    // Cargar rutinas del usuario
    this.rutinaService.getRutinasByCliente(usuarioId).subscribe({
      next: (rutinas) => {
        this.rutinas = rutinas;
        const rutinasMap = new Map<number, Rutina>();
        
        rutinas.forEach(rutina => {
          if (rutina.id) {
            rutinasMap.set(rutina.id, rutina);
            if (rutina.ejercicios) {
              this.ejerciciosPorRutina.set(rutina.id, rutina.ejercicios);
            }
          }
        });

        // Cargar progresos
        this.progresoService.getProgresosByUsuario(usuarioId).subscribe({
          next: (progresos) => {
            // Manejo seguro de rutinaId
            this.progresos = progresos.map(p => ({
              ...p,
              // Usar rutinaId
              rutina: p.rutinaId ? rutinasMap.get(p.rutinaId) || null : null
            }));
            
            this.calcularEstadisticas();
            this.dibujarGrafico();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar progresos:', err);
            this.error = 'Error al cargar los datos de progreso';
            this.loading = false;
          }
        });
      },

      error: (err) => {
        console.error('Error al cargar rutinas:', err);
        this.error = 'Error al cargar las rutinas';
        this.loading = false;
      }
    });

    // Cargar todos los ejercicios
    this.ejercicioService.getEjercicios().subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
        this.actualizarEjerciciosFiltrados();
      },
      error: (err) => {
        console.error('Error al cargar ejercicios:', err);
      }
    });

    this.rutinaService.getRutinasByCliente(usuarioId).subscribe({
      next: (rutinas) => {
        this.rutinas = rutinas;
        // Verificar existencia de rutina.id
        rutinas.forEach(rutina => {
          if (rutina.id && rutina.ejercicios) {
            this.ejerciciosPorRutina.set(rutina.id, rutina.ejercicios);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar rutinas:', err);
      }
    });
  }

  // Actualizar ejercicios al cambiar rutina
  onRutinaChange(): void {
    this.actualizarEjerciciosFiltrados();
    this.filtros.ejercicioId = null; // Resetear ejercicio seleccionado
  }

  // Filtrar ejercicios basados en rutina seleccionada
  private actualizarEjerciciosFiltrados(): void {
    if (this.filtros.rutinaId && this.ejerciciosPorRutina.has(this.filtros.rutinaId)) {
      const ejerciciosRutina = this.ejerciciosPorRutina.get(this.filtros.rutinaId);
      if (ejerciciosRutina) {
        const ejercicioIds = ejerciciosRutina.map((ej: any) => ej.ejercicioId);
        this.ejerciciosFiltrados = this.ejercicios.filter(ejercicio => 
          ejercicioIds.includes(ejercicio.id)
        );
      }
    } else {
      this.ejerciciosFiltrados = [...this.ejercicios];
    }
  }

  aplicarFiltros(): void {
    const usuarioId = this.authService.getCurrentUserId();
    if (!usuarioId) return;

    this.loading = true;
    this.error = null;

    // Construir objeto de filtros
    const params: any = {};
    if (this.filtros.rutinaId) params.rutinaId = this.filtros.rutinaId;
    if (this.filtros.ejercicioId) params.ejercicioId = this.filtros.ejercicioId;
    if (this.filtros.fechaDesde) params.fechaDesde = this.filtros.fechaDesde;
    if (this.filtros.fechaHasta) params.fechaHasta = this.filtros.fechaHasta;

    this.progresoService.getProgresosByUsuario(usuarioId).subscribe({
      next: (progresos) => {
        const rutinasMap = new Map<number, Rutina>();
        this.rutinas.forEach(r => rutinasMap.set(r.id!, r));

        // Filtrado seguro que maneja rutinaId undefined
        this.progresos = progresos.filter(p => {
          let cumple = true;
          
          // Manejar rutinaId undefined o null
          if (this.filtros.rutinaId) {
            cumple = cumple && (p.rutinaId === this.filtros.rutinaId);
          }
          
          if (this.filtros.ejercicioId) {
            cumple = cumple && (p.ejercicioId === this.filtros.ejercicioId);
          }
          
          if (this.filtros.fechaDesde && p.fechaRegistro) {
            const fechaProgreso = new Date(p.fechaRegistro);
            const fechaDesde = new Date(this.filtros.fechaDesde);
            cumple = cumple && (fechaProgreso >= fechaDesde);
          }
          
          if (this.filtros.fechaHasta && p.fechaRegistro) {
            const fechaProgreso = new Date(p.fechaRegistro);
            const fechaHasta = new Date(this.filtros.fechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1);
            cumple = cumple && (fechaProgreso < fechaHasta);
          }
          
          return cumple;
        }).map(p => ({
          ...p,
          rutina: p.rutinaId ? rutinasMap.get(p.rutinaId) || null : null
        }));
        
        this.calcularEstadisticas();
        this.dibujarGrafico();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al filtrar progresos:', err);
        this.error = 'Error al aplicar los filtros';
        this.loading = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      rutinaId: null,
      ejercicioId: null,
      fechaDesde: null,
      fechaHasta: null
    };
    this.cargarDatosIniciales();
  }

  calcularEstadisticas(): void {
    this.estadisticas = ProgresoHelper.calcularEstadisticas(this.progresos);
  }

  formatearFecha(fecha?: string): string {
    return ProgresoHelper.formatearFecha(fecha);
  }

  // estadisticas.component.ts - Modificaciones en el método dibujarGrafico
  dibujarGrafico(): void {
  if (!this.chartContext || this.progresos.length === 0) {
    console.log('No hay contexto de gráfico o progresos vacíos');
    return;
  }
  
  const ctx = this.chartContext;
  const canvas = this.pesoChart.nativeElement;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Filtrar progresos con peso y fecha válidos
  const datos = this.progresos
    .filter(p => {
      const tieneFecha = !!p.fechaRegistro;
      const tienePeso = p.pesoUtilizado !== null && p.pesoUtilizado !== undefined;
      if (!tieneFecha) console.log('Progreso sin fecha:', p);
      if (!tienePeso) console.log('Progreso sin peso:', p);
      return tieneFecha && tienePeso;
    })
    .map(p => ({
      fecha: new Date(p.fechaRegistro),
      peso: Number(p.pesoUtilizado)
    }))
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  
  console.log('Datos para gráfico:', datos);
  
  if (datos.length === 0) {
    console.log('No hay datos válidos para mostrar el gráfico');
    return;
  }

  // Configuración del gráfico
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const width = canvas.width - margin.left - margin.right;
  const height = canvas.height - margin.top - margin.bottom;
  
  // Calcular escalas
  const fechas = datos.map(d => d.fecha);
  const pesos = datos.map(d => d.peso);
  const minDate = Math.min(...fechas.map(d => d.getTime()));
  const maxDate = Math.max(...fechas.map(d => d.getTime()));
  const minPeso = Math.min(...pesos);
  const maxPeso = Math.max(...pesos);
  
  // Función para mapear fecha a coordenada X
  const xScale = (date: Date) => {
    return margin.left + (date.getTime() - minDate) / (maxDate - minDate) * width;
  };
  
  // Función para mapear peso a coordenada Y
  const yScale = (peso: number) => {
    return margin.top + height - ((peso - minPeso) / (maxPeso - minPeso)) * height;
  };
  
  // Dibujar ejes
  ctx.beginPath();
  // Eje Y
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + height);
  // Eje X
  ctx.lineTo(margin.left + width, margin.top + height);
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Dibujar línea de progresión
  ctx.beginPath();
  datos.forEach((d, index) => {
    const x = xScale(d.fecha);
    const y = yScale(d.peso);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Dibujar punto
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Etiquetas del eje X (fechas)
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  
  // Mostrar algunas fechas para no saturar
  const paso = Math.max(1, Math.ceil(datos.length / 5));
  for (let i = 0; i < datos.length; i += paso) {
    const d = datos[i];
    const x = xScale(d.fecha);
    const y = margin.top + height + 20;
    const fechaFormateada = this.datePipe.transform(d.fecha, 'shortDate') || '';
    
    // Verificar que la etiqueta no se salga del canvas
    if (x >= margin.left && x <= margin.left + width) {
      ctx.fillText(fechaFormateada, x, y);
    }
  }
  
  // Etiquetas del eje Y (peso)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const pasosPeso = 5;
  for (let i = 0; i <= pasosPeso; i++) {
    const peso = minPeso + (maxPeso - minPeso) * (i / pasosPeso);
    const y = yScale(peso);
    ctx.fillText(peso.toFixed(1), margin.left - 10, y);
  }
  
  // Títulos de los ejes
  ctx.textAlign = 'center';
  ctx.fillText('Fecha', margin.left + width / 2, margin.top + height + 40);
  
  ctx.save();
  ctx.translate(margin.left - 30, margin.top + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Peso (kg)', 0, 0);
  ctx.restore();
}
}