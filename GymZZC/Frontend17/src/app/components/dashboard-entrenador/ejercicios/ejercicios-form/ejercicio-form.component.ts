import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ejercicio, TipoEjercicioEnum } from '../../../../models/ejercicio.model';
import { EjercicioService } from '../../../../services/ejercicio.service';

@Component({
  selector: 'app-ejercicio-form',
  templateUrl: './ejercicio-form.component.html'
})

export class EjercicioFormComponent implements OnInit {
  ejercicioForm: FormGroup;
  isEditMode = false;
  ejercicioId: number | null = null;
  tiposEjercicio: TipoEjercicioEnum[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  // Getters para los controles del formulario
  get nombre(): AbstractControl { return this.ejercicioForm.get('nombre') as AbstractControl; }
  get tipo(): AbstractControl { return this.ejercicioForm.get('tipo') as AbstractControl; }
  get descripcion(): AbstractControl { return this.ejercicioForm.get('descripcion') as AbstractControl; }

  constructor(
    private fb: FormBuilder,
    private ejercicioService: EjercicioService,
    public router: Router, // Cambiado a público para acceso en plantilla
    private route: ActivatedRoute
  ) {
    this.ejercicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Obtener tipos de ejercicio
    this.tiposEjercicio = this.ejercicioService.getTiposEjercicio();
    
    // Verificar modo edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.ejercicioId = +id;
        this.cargarEjercicio(this.ejercicioId);
      }
    });
  }

  // Método para obtener nombre legible del tipo
  getTipoDisplayName(tipo: TipoEjercicioEnum): string {
    return this.ejercicioService.getTipoDisplayName(tipo);
  }

  cargarEjercicio(id: number): void {
    this.isLoading = true;
    this.ejercicioService.getEjercicioById(id).subscribe({
      next: (ejercicio) => {
        this.ejercicioForm.patchValue({
          nombre: ejercicio.nombre,
          tipo: ejercicio.tipo,
          descripcion: ejercicio.descripcion || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando ejercicio', error);
        this.errorMessage = 'Error al cargar el ejercicio';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.ejercicioForm.invalid) {
      this.ejercicioForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const ejercicio: Ejercicio = this.ejercicioForm.value;

    const request$ = this.isEditMode && this.ejercicioId
      ? this.ejercicioService.updateEjercicio(this.ejercicioId, ejercicio)
      : this.ejercicioService.createEjercicio(ejercicio);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/entrenador/ejercicios']);
      },
      error: (error) => {
        console.error('Error en operación', error);
        this.errorMessage = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} ejercicio`;
        this.isLoading = false;
      }
    });
  }
}