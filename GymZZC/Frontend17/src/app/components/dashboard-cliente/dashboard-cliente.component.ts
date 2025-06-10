// dashboard-cliente/dashboard-cliente.component.ts
import { Component, OnInit } from '@angular/core';
import { EjercicioService, Ejercicio } from '../../services/ejercicio.service';
import { ProgresoService, Progreso } from '../../services/progreso.service';
import { RutinaService, Rutina, RutinaEjercicio } from '../../services/rutina.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.component.html',
  styleUrls: ['./dashboard-cliente.component.css']
})
export class DashboardClienteComponent implements OnInit {
  selectedExerciseId: number | null = null;
  selectedRepetitions: number = 0;
  selectedSeries: number = 0;
  selectedRutinaId: number | null = null;
  pesoUtilizado: number | null = null;
  
  selectedRutinaEjercicios: RutinaEjercicio[] = [];
  rutinaEjercicioMap: Map<number, RutinaEjercicio> = new Map();
  ejercicios: Ejercicio[] = [];
  rutinas: Rutina[] = [];
  registeredExercises: Progreso[] = [];
  rutinaDetalle: Rutina | null = null;
  selectedExercise: Ejercicio | null = null;
  ejercicioRecomendado: RutinaEjercicio | null = null;

  repeticiones = [5, 6, 8, 10, 12, 15, 20, 25, 30];
  series = [1, 2, 3, 4, 5, 6];

  constructor(
    private ejercicioService: EjercicioService,
    private progresoService: ProgresoService,
    private rutinaService: RutinaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEjercicios();
    this.loadRutinas();
    this.loadProgresosHoy();
  }

  loadEjercicios(): void {
    this.ejercicioService.getEjercicios().subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
      },
      error: (err) => {
        console.error('Error al cargar ejercicios:', err);
      }
    });
  }

  loadRutinas(): void {
    const currentUser = this.authService.getCurrentUser();
    const usuarioId = currentUser?.id ?? null;
    
    if (usuarioId) {
      this.rutinaService.getRutinasByCliente(usuarioId).subscribe({
        next: (rutinas) => {
          this.rutinas = rutinas;
          if (rutinas.length > 0) {
            this.selectedRutinaId = rutinas[0].id ?? null;
            this.onRutinaChange();
          }
        },
        error: (err) => {
          console.error('Error al cargar rutinas:', err);
        }
      });
    }
  }

  onRutinaChange(): void {
    if (this.selectedRutinaId) {
      const rutina = this.rutinas.find(r => r.id === this.selectedRutinaId);
      if (rutina) {
        this.rutinaDetalle = rutina;
        this.selectedRutinaEjercicios = rutina.ejercicios || [];
        
        this.rutinaEjercicioMap.clear();
        this.selectedRutinaEjercicios.forEach(ej => {
          if (ej.ejercicioId) {
            this.rutinaEjercicioMap.set(ej.ejercicioId, ej);
          }
        });
      }
    } else {
      this.rutinaDetalle = null;
      this.selectedRutinaEjercicios = [];
      this.rutinaEjercicioMap.clear();
    }
    this.updateRecomendacion();
  }

  onExerciseChange(): void {
    if (this.selectedExerciseId) {
      this.selectedExercise = this.ejercicios.find(e => e.id === this.selectedExerciseId) || null;
      
      // Buscar recomendación en el mapa
      const recomendacion = this.rutinaEjercicioMap.get(this.selectedExerciseId);
      if (recomendacion) {
        this.ejercicioRecomendado = recomendacion;
        
        // Aplicar valores recomendados a los campos
        this.selectedRepetitions = recomendacion.repeticiones;
        this.selectedSeries = recomendacion.series;
        this.pesoUtilizado = recomendacion.pesoEjercicio || null;
      } else {
        this.ejercicioRecomendado = null;
      }
    } else {
      this.selectedExercise = null;
      this.ejercicioRecomendado = null;
    }
  }

  updateRecomendacion(): void {
    this.ejercicioRecomendado = null;
    
    if (this.rutinaDetalle && this.selectedExerciseId) {
      const ejercicio = this.rutinaDetalle.ejercicios?.find(
        e => e.ejercicioId === this.selectedExerciseId
      );
      
      if (ejercicio) {
        this.ejercicioRecomendado = ejercicio;
      }
    }
  }

  loadProgresosHoy(): void {
    const currentUser = this.authService.getCurrentUser();
    const usuarioId = currentUser?.id ?? null;
    
    if (usuarioId) {
      const hoy = new Date().toISOString().split('T')[0];
      this.progresoService.getProgresosByUsuario(usuarioId).subscribe({
        next: (progresos) => {
          this.registeredExercises = progresos.filter(p => 
            p.fechaRegistro && p.fechaRegistro.startsWith(hoy)
          );
        },
        error: (err) => {
          console.error('Error al cargar progresos:', err);
        }
      });
    }
  }

  registrarEjercicio() {
    const currentUser = this.authService.getCurrentUser();
    const usuarioId = currentUser?.id ?? null;
    
    if (!usuarioId || !this.selectedRutinaId || !this.selectedExerciseId || 
        this.selectedRepetitions <= 0 || this.selectedSeries <= 0) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const nuevoProgreso = this.progresoService.crearProgresoBasico(
      usuarioId,
      this.selectedRutinaId,
      this.selectedExerciseId,
      this.selectedSeries,
      this.selectedRepetitions,
      this.pesoUtilizado ?? undefined
    );

    this.progresoService.registrarProgreso(nuevoProgreso).subscribe({
      next: (progreso) => {
        this.registeredExercises.unshift(progreso);
        // Solo reseteamos campos del ejercicio, mantenienemos la rutina
        this.selectedExerciseId = null;
        this.selectedRepetitions = 0;
        this.selectedSeries = 0;
        this.pesoUtilizado = null;
        this.selectedExercise = null;
        this.ejercicioRecomendado = null;
        
      },
      error: (err) => {
        console.error('Error al registrar progreso:', err);
        alert('Error al registrar el ejercicio');
      }
    });
  }

  eliminarEjercicio(id: number) {
    this.progresoService.deleteProgreso(id).subscribe({
      next: () => {
        this.registeredExercises = this.registeredExercises.filter(exercise => exercise.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar progreso:', err);
        alert('Error al eliminar el ejercicio');
      }
    });
  }
}