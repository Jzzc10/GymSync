// estadisticas.component.ts
import { ProgresoService } from '../../services/progreso.service';
import { RutinaService } from '../../services/rutina.service';
import { EjercicioService } from '../../services/ejercicio.service';
import { AuthService } from '../../services/auth.service';
import { ProgresoHelper } from '../../models/progreso.model';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  providers: [DatePipe]
})
export class EstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChild('pesoChart') pesoChart!: ElementRef<HTMLCanvasElement>;
  private chartContext: CanvasRenderingContext2D | null = null;

  // Datos
  progresos: any[] = [];
  rutinas: any[] = [];
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

  // Datos para gráficos
  chartData: any[] = [];
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'Peso (kg)';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
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

    // Cargar progresos del usuario
    this.progresoService.getProgresosByUsuario(usuarioId).subscribe({
      next: (progresos) => {
        this.progresos = progresos;
        this.calcularEstadisticas();
        this.prepararDatosGrafico();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar progresos:', err);
        this.error = 'Error al cargar los datos de progreso';
        this.loading = false;
      }
    });

    // Cargar rutinas del usuario
    this.rutinaService.getRutinasByCliente(usuarioId).subscribe({
      next: (rutinas) => {
        this.rutinas = rutinas;
      },
      error: (err) => {
        console.error('Error al cargar rutinas:', err);
      }
    });

    // Cargar todos los ejercicios
    this.ejercicioService.getEjercicios().subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
      },
      error: (err) => {
        console.error('Error al cargar ejercicios:', err);
      }
    });
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
        // Aplicar filtros manualmente
        this.progresos = progresos.filter(p => {
          let cumple = true;
          
          if (this.filtros.rutinaId && p.rutinaId !== this.filtros.rutinaId) {
            cumple = false;
          }
          
          if (this.filtros.ejercicioId && p.ejercicioId !== this.filtros.ejercicioId) {
            cumple = false;
          }
          
          if (this.filtros.fechaDesde && p.fechaRegistro) {
            const fechaProgreso = new Date(p.fechaRegistro);
            const fechaDesde = new Date(this.filtros.fechaDesde);
            if (fechaProgreso < fechaDesde) cumple = false;
          }
          
          if (this.filtros.fechaHasta && p.fechaRegistro) {
            const fechaProgreso = new Date(p.fechaRegistro);
            const fechaHasta = new Date(this.filtros.fechaHasta);
            fechaHasta.setDate(fechaHasta.getDate() + 1); // Incluir todo el día
            if (fechaProgreso > fechaHasta) cumple = false;
          }
          
          return cumple;
        });
        
        this.calcularEstadisticas();
        this.prepararDatosGrafico();
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

  prepararDatosGrafico(): void {
    // Agrupar por fecha y ejercicio
    const datosAgrupados: {[key: string]: any} = {};
    
    this.progresos.forEach(p => {
      if (!p.fechaRegistro || !p.ejercicioNombre || !p.pesoUtilizado) return;
      
      const fecha = this.datePipe.transform(p.fechaRegistro, 'dd/MM/yyyy') || p.fechaRegistro;
      const clave = `${fecha}_${p.ejercicioId}`;
      
      if (!datosAgrupados[clave]) {
        datosAgrupados[clave] = {
          name: fecha,
          series: []
        };
      }
      
      // Encontrar si ya existe una entrada para este ejercicio en esta fecha
      const ejercicioExistente = datosAgrupados[clave].series.find(
        (s: any) => s.name === p.ejercicioNombre
      );
      
      if (ejercicioExistente) {
        // Actualizar si el peso es mayor
        if (p.pesoUtilizado > ejercicioExistente.value) {
          ejercicioExistente.value = p.pesoUtilizado;
        }
      } else {
        datosAgrupados[clave].series.push({
          name: p.ejercicioNombre,
          value: p.pesoUtilizado
        });
      }
    });
    
    this.chartData = Object.values(datosAgrupados);
  }

  formatearFecha(fecha?: string): string {
    return ProgresoHelper.formatearFecha(fecha);
  }

  prepararDatosGrafico(): void {
    // Eliminar lógica anterior de ngx-charts
    setTimeout(() => this.dibujarGrafico(), 0);
  }

  dibujarGrafico(): void {
    if (!this.chartContext || this.progresos.length === 0) return;
    
    const ctx = this.chartContext;
    const canvas = this.pesoChart.nativeElement;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Filtrar progresos con peso
    const datos = this.progresos
      .filter(p => p.fechaRegistro && p.pesoUtilizado)
      .sort((a, b) => new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime());
    
    if (datos.length === 0) return;

    // Configuración del gráfico
    const margin = 40;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;
    
    // Calcular escalas
    const fechas = datos.map(p => new Date(p.fechaRegistro));
    const pesos = datos.map(p => p.pesoUtilizado);
    const minDate = Math.min(...fechas.map(d => d.getTime()));
    const maxDate = Math.max(...fechas.map(d => d.getTime()));
    const minPeso = Math.min(...pesos);
    const maxPeso = Math.max(...pesos);
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height + margin);
    ctx.lineTo(width + margin, height + margin);
    ctx.strokeStyle = '#374151';
    ctx.stroke();
    
    // Dibujar líneas de peso
    ctx.beginPath();
    datos.forEach((p, i) => {
      const x = margin + (width * (new Date(p.fechaRegistro).getTime() - minDate)) / (maxDate - minDate);
      const y = margin + height - (height * (p.pesoUtilizado - minPeso)) / (maxPeso - minPeso);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      
      // Dibujar punto
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Etiquetas
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Fecha', width / 2 + margin, height + margin + 30);
    
    ctx.save();
    ctx.translate(10, height / 2 + margin);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Peso (kg)', 0, 0);
    ctx.restore();
  }
}