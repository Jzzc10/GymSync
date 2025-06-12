import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService, Rutina, RutinaEjercicio } from '../../../../services/rutina.service';
import { EjercicioService } from '../../../../services/ejercicio.service';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-rutina-form',
  templateUrl: './rutina-form.component.html',
  styleUrls: ['./rutina-form.component.css'],
})
export class RutinaFormComponent implements OnInit {
  rutinaForm: FormGroup;
  isEditMode = false;
  rutinaId?: number;
  ejercicios: any[] = [];
  clientes: any[] = [];
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private ejercicioService: EjercicioService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.rutinaForm = this.fb.group({
      clienteId: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      activa: [true],
      ejercicios: this.fb.array([])
    });
  }

  get ejerciciosFormArray(): FormArray {
    return this.rutinaForm.get('ejercicios') as FormArray;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    try {
      this.isLoading = true;
      
      // Cargar ejercicios y clientes en paralelo
      await Promise.all([
        this.cargarEjercicios(),
        this.cargarClientes()
      ]);
      
      // Verificar si es modo edición
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.rutinaId = +params['id'];
          this.cargarRutina(this.rutinaId);
        } else {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.isLoading = false;
    }
  }

  cargarRutina(id: number): void {
    this.rutinaService.getRutinaById(id).subscribe({
      next: (rutina) => {
        this.rutinaForm.patchValue({
          clienteId: rutina.clienteId,
          descripcion: rutina.descripcion,
          activa: rutina.activa
        });

        // Limpiar array de ejercicios antes de cargar
        while (this.ejerciciosFormArray.length !== 0) {
          this.ejerciciosFormArray.removeAt(0);
        }

        // Agregar ejercicios al form array
        rutina.ejercicios?.forEach(ejercicio => {
          this.agregarEjercicio(
            ejercicio.ejercicioId!,
            ejercicio.series ?? 0,
            ejercicio.repeticiones ?? 0,
            ejercicio.pesoEjercicio ?? null
          );
        });
      },
      error: (error) => {
        console.error('Error cargando rutina:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    
  }

  cargarEjercicios(): void {
    this.ejercicioService.getEjercicios().subscribe(
      ejercicios => this.ejercicios = ejercicios,
      error => console.error('Error cargando ejercicios', error)
    );
  }

  cargarClientes(): void {
    const entrenadorId = this.authService.getCurrentUserId();
    if (entrenadorId) {
      this.usuarioService.getClientesAsignados(entrenadorId).subscribe(
        clientes => this.clientes = clientes,
        error => console.error('Error cargando clientes', error)
      );
    }
  }

  agregarEjercicio(ejercicioId?: number, series: number = 3, repeticiones: number = 10, peso?: number | null): void {
    const ejercicioGroup = this.fb.group({
      ejercicioId: [ejercicioId || '', Validators.required],
      series: [series, [Validators.required, Validators.min(1)]],
      repeticiones: [repeticiones, [Validators.required, Validators.min(1)]],
      pesoEjercicio: [peso || null, [Validators.min(0)]]
    });
    this.ejerciciosFormArray.push(ejercicioGroup);
  }

  eliminarEjercicio(index: number): void {
    this.ejerciciosFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.rutinaForm.invalid) {
      this.marcarControlesComoTouched();
      return;
    }

    const rutinaData = {
      ...this.rutinaForm.value,
      entrenadorId: this.authService.getCurrentUserId()
    };

    if (this.isEditMode && this.rutinaId) {
      this.rutinaService.updateRutina(this.rutinaId, rutinaData).subscribe({
        next: () => this.router.navigate(['/entrenador/rutinas']),
        error: (err) => console.error('Error actualizando rutina', err)
      });
    } else {
      this.rutinaService.createRutina(rutinaData).subscribe({
        next: () => this.router.navigate(['/entrenador/rutinas']),
        error: (err) => console.error('Error creando rutina', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/entrenador/rutinas']);
  }

  private marcarControlesComoTouched(): void {
    Object.values(this.rutinaForm.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.values(group.controls).forEach(subControl => {
              subControl.markAsTouched();
            });
          }
        });
      }
    });
  }
}