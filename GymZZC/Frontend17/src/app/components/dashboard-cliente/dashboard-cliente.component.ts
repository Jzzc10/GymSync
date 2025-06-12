// dashboard-cliente/dashboard-cliente.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EjercicioService } from '../../services/ejercicio.service';
import { Ejercicio, TipoEjercicioEnum } from '../../models/ejercicio.model';
import { ProgresoService, Progreso } from '../../services/progreso.service';
import { RutinaService, Rutina, RutinaEjercicio } from '../../services/rutina.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MadridTimePipe } from '../../pipes/madridTime.pipe';

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.component.html',
  styleUrls: ['./dashboard-cliente.component.css'],
  providers: [DatePipe, MadridTimePipe]
})
export class DashboardClienteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  selectedExerciseId: number | null = null;
  selectedRepetitions: number | null = null;
  selectedSeries: number | null = null;
  selectedRutinaId: number | null = null;
  pesoUtilizado: number | null = null;
  
  selectedRutinaEjercicios: RutinaEjercicio[] = [];
  rutinaEjercicioMap: Map<number, RutinaEjercicio> = new Map();
  ejercicios: Ejercicio[] = [];
  rutinas: Rutina[] = [];
  registeredExercises: Progreso[] = [];
  rutinaDetalle: Rutina | null = null;
  selectedExercise: Ejercicio | null = null;

  // Estados de carga y error
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  validationErrors: string[] = [];
  
  // Propiedades para mostrar errores específicos
  showRutinaError = false;
  showEjercicioError = false;
  
  // Modal de eliminación
  showDeleteModal = false;
  exerciseToDelete: number | null = null;
  
  // Flags para mostrar intentos de validación
  attemptedSubmit = false;

  repeticiones = [5, 6, 8, 10, 12, 15, 20, 25, 30];
  series = [1, 2, 3, 4, 5, 6];

  constructor(
    private ejercicioService: EjercicioService,
    private progresoService: ProgresoService,
    private rutinaService: RutinaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.isLoading = true;
    this.clearAllErrors();
    
    // Cargar datos en paralelo
    Promise.all([
      this.loadEjercicios(),
      this.loadRutinas(),
      this.loadProgresosHoy()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  private loadEjercicios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ejercicioService.getEjercicios()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (ejercicios) => {
            this.ejercicios = ejercicios || [];
            console.log(`Cargados ${this.ejercicios.length} ejercicios`);
            resolve();
          },
          error: (err) => {
            console.error('Error al cargar ejercicios:', err);
            this.setError('Error al cargar los ejercicios. Por favor, recarga la página.');
            this.ejercicios = [];
            resolve();
          }
        });
    });
  }

  private loadRutinas(): Promise<void> {
    return new Promise((resolve, reject) => {
      const currentUser = this.authService.getCurrentUser();
      const usuarioId = currentUser?.id;
      
      if (!usuarioId) {
        this.setError('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
        this.rutinas = [];
        resolve();
        return;
      }

      this.rutinaService.getRutinasByCliente(usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (rutinas) => {
            this.rutinas = rutinas || [];
            console.log(`Cargadas ${this.rutinas.length} rutinas para el usuario ${usuarioId}`);
            
            if (this.rutinas.length > 0) {
              const rutinaActiva = this.rutinas.find(r => r.activa) || this.rutinas[0];
              this.selectedRutinaId = rutinaActiva.id ?? null;
              if (this.selectedRutinaId) {
                this.onRutinaChange();
              }
            } else {
              console.warn('No se encontraron rutinas para el usuario');
            }
            resolve();
          },
          error: (err) => {
            console.error('Error al cargar rutinas:', err);
            this.setError('Error al cargar las rutinas asignadas. Por favor, contacta con tu entrenador.');
            this.rutinas = [];
            resolve();
          }
        });
    });
  }

  onRutinaChange(): void {
    this.updateValidationErrors();
    
    if (!this.selectedRutinaId) {
      this.resetRutinaData();
      return;
    }

    console.log(`Cargando detalles de rutina ID: ${this.selectedRutinaId}`);

    this.rutinaService.getRutinaById(this.selectedRutinaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rutina) => {
          this.rutinaDetalle = rutina;
          this.selectedRutinaEjercicios = rutina.ejercicios || [];
          
          console.log(`Rutina cargada: ${rutina.descripcion}, ${this.selectedRutinaEjercicios.length} ejercicios`);
          
          // SOLUCIÓN: Solo mostrar error si realmente no hay ejercicios
          if (this.selectedRutinaEjercicios.length === 0) {
            this.setError('La rutina seleccionada no tiene ejercicios asignados. Contacta con tu entrenador.');
          } else {
            this.clearError(); // Limpiar error si hay ejercicios
          }
          
          this.updateRutinaEjercicioMap();
          this.resetExerciseSelection();
        },
        error: (err) => {
          console.error('Error al cargar detalles de rutina:', err);
          this.setError('Error al cargar los detalles de la rutina seleccionada.');
          
          const rutina = this.rutinas.find(r => r.id === this.selectedRutinaId);
          if (rutina) {
            this.rutinaDetalle = rutina;
            this.selectedRutinaEjercicios = rutina.ejercicios || [];
            
            // SOLUCIÓN: Verificar aquí también si hay ejercicios
            if (this.selectedRutinaEjercicios.length === 0) {
              this.setError('La rutina seleccionada no tiene ejercicios asignados. Contacta con tu entrenador.');
            } else {
              this.clearError();
            }
            
            this.updateRutinaEjercicioMap();
            this.resetExerciseSelection();
          } else {
            this.resetRutinaData();
          }
        }
      });
  }

  private resetRutinaData(): void {
    this.rutinaDetalle = null;
    this.selectedRutinaEjercicios = [];
    this.rutinaEjercicioMap.clear();
    this.resetExerciseSelection();
  }

  private updateRutinaEjercicioMap(): void {
    this.rutinaEjercicioMap.clear();
    this.selectedRutinaEjercicios.forEach(ej => {
      if (ej.ejercicioId) {
        this.rutinaEjercicioMap.set(ej.ejercicioId, ej);
      }
    });
    console.log(`Actualizado mapa de ejercicios: ${this.rutinaEjercicioMap.size} ejercicios`);
  }

  private resetExerciseSelection(): void {
    this.selectedExerciseId = null;
    this.selectedExercise = null;
    this.selectedRepetitions = null;
    this.selectedSeries = null;
    this.pesoUtilizado = null;
    this.updateValidationErrors();
  }

  onExerciseChange(): void {
    this.updateValidationErrors();
    
    if (!this.selectedExerciseId) {
      this.resetExerciseData();
      return;
    }

    // Convertir ID a número para comparación consistente
    const selectedId = Number(this.selectedExerciseId);

    // Buscar en lista general de ejercicios
    const ejercicioEncontrado = this.ejercicios.find(e => e.id === selectedId);
    
    if (ejercicioEncontrado) {
      this.selectedExercise = ejercicioEncontrado;
      this.clearError();
    } else {
      console.warn('Ejercicio no encontrado en lista general, buscando en rutina...');
      
      // Buscar en ejercicios de la rutina (comparando como números)
      const ejercicioRutina = this.selectedRutinaEjercicios.find(
        re => re.ejercicioId === selectedId
      );
      
      if (ejercicioRutina) {
        // Priorizar el ejercicio expandido si existe
        if (ejercicioRutina.ejercicio) {
          this.selectedExercise = ejercicioRutina.ejercicio;
        } 
        // Usar datos mínimos si solo tenemos información básica
        else if (ejercicioRutina.ejercicioNombre) {
          this.selectedExercise = {
            id: selectedId,
            nombre: ejercicioRutina.ejercicioNombre,
            tipo: ejercicioRutina.ejercicioTipo as TipoEjercicioEnum || TipoEjercicioEnum.PECHO, // CAST A TIPO CORRECTO
            descripcion: '',
            urlImagen: '',
            urlVideo: ''
          };
        }
        // Crear placeholder como último recurso
        else {
          this.selectedExercise = {
            id: selectedId,
            nombre: 'Ejercicio de rutina',
            tipo: TipoEjercicioEnum.PECHO, // VALOR VÁLIDO DEL ENUM
            descripcion: '',
            urlImagen: '',
            urlVideo: ''
          };
        }
        this.clearError();
      } else {
        this.setError('Error: El ejercicio seleccionado no se encuentra disponible.');
        this.resetExerciseData();
      }
    }
  }

  private resetExerciseData(): void {
    this.selectedExercise = null;
    this.selectedRepetitions = null;
    this.selectedSeries = null;
    this.pesoUtilizado = null;
  }

  private loadProgresosHoy(): Promise<void> {
    return new Promise((resolve) => {
      const currentUser = this.authService.getCurrentUser();
      const usuarioId = currentUser?.id;
      
      if (!usuarioId) {
        this.registeredExercises = [];
        resolve();
        return;
      }

      const hoy = new Date().toISOString().split('T')[0];
      
      this.progresoService.getProgresosByUsuario(usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (progresos) => {
            this.registeredExercises = (progresos || []).filter(p => 
              p.fechaRegistro && p.fechaRegistro.startsWith(hoy)
            );
            console.log(`Cargados ${this.registeredExercises.length} progresos de hoy`);
            resolve();
          },
          error: (err) => {
            console.error('Error al cargar progresos:', err);
            this.registeredExercises = [];
            resolve();
          }
        });
    });
  }

  registrarEjercicio(): void {
    if (this.isSubmitting) {
      return;
    }

    this.attemptedSubmit = true;

    const currentUser = this.authService.getCurrentUser();
    const usuarioId = currentUser?.id;
    
    const validationResult = this.validateRegistration(usuarioId);
    if (!validationResult.isValid) {
      this.validationErrors = validationResult.errors;
      this.setError('Por favor, corrige los errores antes de continuar.');
      this.updateValidationErrors();
      return;
    }

    this.isSubmitting = true;
    this.clearAllErrors();

    const nuevoProgreso = this.progresoService.crearProgresoBasico(
      usuarioId!,
      this.selectedRutinaId!,
      this.selectedExerciseId!,
      this.selectedSeries ?? 0,
      this.selectedRepetitions ?? 0,
      this.pesoUtilizado ?? 0
    );

    this.progresoService.registrarProgreso(nuevoProgreso)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (progreso) => {
          console.log('Progreso registrado exitosamente:', progreso);
          this.registeredExercises.unshift(progreso);
          this.resetExerciseSelection();
          this.attemptedSubmit = false; // Reset después de éxito
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error al registrar progreso:', err);
          this.setError('Error al registrar el ejercicio. Verifica los datos e inténtalo de nuevo.');
          this.isSubmitting = false;
        }
      });
  }

  private validateRegistration(usuarioId: number | undefined): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!usuarioId) {
      errors.push('Usuario no autenticado');
    }

    if (!this.selectedRutinaId) {
      errors.push('Debe seleccionar una rutina');
    }

    if (!this.selectedExerciseId) {
      errors.push('Debe seleccionar un ejercicio');
    }

    if (this.pesoUtilizado !== null && (this.pesoUtilizado < 0 || isNaN(this.pesoUtilizado))) {
      errors.push('El peso debe ser un número positivo o vacío');
    }

    return { isValid: errors.length === 0, errors };
  }

  eliminarEjercicio(id: number): void {
    if (!id) {
      console.error('ID de ejercicio no válido:', id);
      return;
    }
    
    console.log('Intentando eliminar ejercicio con ID:', id);
    this.exerciseToDelete = id;
    this.showDeleteModal = true;
    console.log('Modal de eliminación mostrado:', this.showDeleteModal);
  }

  cancelDelete(): void {
    console.log('Cancelando eliminación');
    this.showDeleteModal = false;
    this.exerciseToDelete = null;
  }

  confirmDelete(): void {
    if (!this.exerciseToDelete) {
      console.warn('No hay ejercicio seleccionado para eliminar');
      this.showDeleteModal = false;
      return;
    }

    const id = this.exerciseToDelete;
    console.log('Confirmando eliminación del ejercicio:', id);
    
    this.progresoService.deleteProgreso(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.registeredExercises = this.registeredExercises.filter(exercise => exercise.id !== id);
          console.log(`Progreso ${id} eliminado exitosamente`);
          this.showDeleteModal = false;
          this.exerciseToDelete = null;
        },
        error: (err) => {
          console.error('Error al eliminar progreso:', err);
          this.setError('Error al eliminar el ejercicio. Por favor, inténtalo de nuevo.');
          this.showDeleteModal = false;
          this.exerciseToDelete = null;
        }
      });
  }

  // Método para actualizar errores de validación en tiempo real
  private updateValidationErrors(): void {
    if (!this.attemptedSubmit) return;
    
    const currentUser = this.authService.getCurrentUser();
    const usuarioId = currentUser?.id;
    const validationResult = this.validateRegistration(usuarioId);
    
    this.validationErrors = validationResult.errors;
    this.showRutinaError = this.validationErrors.includes('Debe seleccionar una rutina');
    this.showEjercicioError = this.validationErrors.includes('Debe seleccionar un ejercicio');
  }

  // Métodos auxiliares para el template
  get hasRutinas(): boolean {
    return this.rutinas.length > 0;
  }

  get hasEjercicios(): boolean {
    return this.ejercicios.length > 0;
  }

  get canRegisterExercise(): boolean {
    return !this.isSubmitting && 
          !!this.selectedRutinaId && 
          !!this.selectedExerciseId &&
          (this.pesoUtilizado === null || (this.pesoUtilizado >= 0 && !isNaN(this.pesoUtilizado)));
  }

  get exercisesForSelectedRutina(): Ejercicio[] {
    if (!this.rutinaDetalle?.ejercicios || this.ejercicios.length === 0) {
      return [];
    }
    
    const ejercicioIds = this.rutinaDetalle.ejercicios
      .map(re => re.ejercicioId)
      .filter(id => id !== undefined && id !== null);
    
    return this.ejercicios.filter(ejercicio => 
      ejercicio.id && ejercicioIds.includes(ejercicio.id)
    );
  }

  get hasValidRutinaSelection(): boolean {
    return !!this.selectedRutinaId && !!this.rutinaDetalle;
  }

  get hasExercisesInSelectedRutina(): boolean {
    return this.hasValidRutinaSelection && this.exercisesForSelectedRutina.length > 0;
  }

  // Métodos de utilidad para validación
  private isValidNumber(value: any): boolean {
    return value !== null && value !== undefined && !isNaN(Number(value));
  }

  private isValidPositiveNumber(value: any): boolean {
    return this.isValidNumber(value) && Number(value) > 0;
  }

  // Métodos para manejo de errores
  private setError(message: string): void {
    this.error = message;
    console.error('Error en componente:', message);
  }

  private clearAllErrors(): void {
    this.error = null;
    this.validationErrors = [];
    this.showRutinaError = false;
    this.showEjercicioError = false;
  }

  private clearValidationErrors(): void {
    this.validationErrors = [];
    this.showRutinaError = false;
    this.showEjercicioError = false;
  }

  clearError(): void {
    this.error = null;
  }

  // Métodos auxiliares para el template
  getSeriesDisplayValue(): number | string {
    return this.selectedSeries ?? '';
  }

  getRepetitionsDisplayValue(): number | string {
    return this.selectedRepetitions ?? '';
  }

  // Método para formatear la recomendación
  formatRecomendacion(rutinaEjercicio: RutinaEjercicio): string {
    const series = rutinaEjercicio.series ?? 'N/A';
    const repeticiones = rutinaEjercicio.repeticiones ?? 'N/A';
    const peso = rutinaEjercicio.pesoEjercicio ? ` (${rutinaEjercicio.pesoEjercicio} kg)` : '';
    
    return `${series} series x ${repeticiones} repeticiones${peso}`;
  }

  // Métodos para verificar errores específicos
  hasRutinaError(): boolean {
    return this.attemptedSubmit && (!this.selectedRutinaId || this.validationErrors.includes('Debe seleccionar una rutina'));
  }

  hasEjercicioError(): boolean {
    return this.attemptedSubmit && (!this.selectedExerciseId || this.validationErrors.includes('Debe seleccionar un ejercicio'));
  }
}