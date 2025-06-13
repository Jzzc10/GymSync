import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService, Rutina, RutinaEjercicio } from '../../../../services/rutina.service';
import { EjercicioService } from '../../../../services/ejercicio.service';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { forkJoin, of, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  usuarios: any[] = [];
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
    this.rutinaForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      clienteId: ['', [Validators.required, this.clienteValidator.bind(this)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      ejercicios: this.fb.array([])
    });
  }

  private clienteValidator(control: any) {
    const value = this.parseClienteId(control.value);
    
    if (!value || value <= 0) {
      return { clienteRequired: true };
    }
    
    if (this.usuarios?.length > 0 && !this.usuarios.some(u => u.id === value)) {
      return { clienteNoExiste: true };
    }
    
    return null;
  }

  get ejerciciosFormArray(): FormArray {
    return this.rutinaForm.get('ejercicios') as FormArray;
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  private async initializeComponent(): Promise<void> {
    try {
      this.isLoading = true;
      
      await this.loadBaseData();
      
      const id = this.route.snapshot.params['id'];
      if (id) {
        this.isEditMode = true;
        this.rutinaId = +id;
        await this.loadRutina(this.rutinaId);
      }
    } catch (error) {
      console.error('Error inicializando componente:', error);
      alert('Error al cargar los datos. Por favor, recarga la página.');
    } finally {
      this.isLoading = false;
    }
  }

  private async loadBaseData(): Promise<void> {
    const ejercicios$ = this.ejercicioService.getEjercicios().pipe(
      catchError(err => {
        console.error('Error cargando ejercicios:', err);
        return of([]);
      })
    );

    const clientes$ = this.loadClientes().pipe(
      catchError(err => {
        console.error('Error cargando clientes:', err);
        return of([]);
      })
    );

    try {
      const [ejercicios, clientes] = await lastValueFrom(forkJoin([ejercicios$, clientes$]));
      
      this.ejercicios = ejercicios || [];
      this.usuarios = this.validateClientes(clientes || []);
      
      console.log('Datos cargados:', {
        ejercicios: this.ejercicios.length,
        clientes: this.usuarios.length,
        clientesData: this.usuarios
      });

      if (this.usuarios.length === 0) {
        console.warn('No se cargaron clientes disponibles');
      }
      
    } catch (error) {
      console.error('Error cargando datos base:', error);
      this.ejercicios = [];
      this.usuarios = [];
      throw error;
    }
  }

  private loadClientes() {
    const userRole = this.authService.getUserRole();
    
    if (userRole === 'ENTRENADOR') {
      return this.usuarioService.getMisClientes().pipe(
        catchError(() => this.loadClientesAlternativos())
      );
    }
    
    if (userRole === 'ADMIN') {
      return this.usuarioService.getClientes?.() || this.loadAllUsuarios();
    }
    
    return of([]);
  }

  private loadClientesAlternativos() {
    const currentUserId = this.authService.getCurrentUserId();
    
    if (!currentUserId) return of([]);
    
    return this.usuarioService.getClientesAsignados(currentUserId).pipe(
      catchError(() => this.loadAllUsuarios())
    );
  }

  private loadAllUsuarios() {
    return this.usuarioService.getUsuarios({ rol: 'CLIENTE' }).pipe(
      catchError(() => this.usuarioService.getUsuarios())
    );
  }

  private validateClientes(clientes: any[]): any[] {
    if (!Array.isArray(clientes)) return [];
    
    return clientes.filter(cliente => 
      cliente?.id > 0 && 
      cliente?.nombre?.trim() && 
      cliente?.rol === 'CLIENTE'
    );
  }

  private async loadRutina(id: number): Promise<void> {
    try {
      const rutina = await lastValueFrom(this.rutinaService.getRutinaById(id));
      
      if (!rutina) throw new Error('Rutina no encontrada');
      
      // FIXED: Handle both clienteId and usuarioId fields
      const clienteId = rutina.clienteId || rutina.usuarioId || rutina.cliente?.id;
      
      // Cargar datos básicos
      this.rutinaForm.patchValue({
        clienteId: clienteId ? clienteId.toString() : '',
        descripcion: rutina.descripcion || ''
      });

      // Cargar ejercicios
      this.ejerciciosFormArray.clear();
      if (rutina.ejercicios && rutina.ejercicios.length > 0) {
        rutina.ejercicios.forEach(ejercicio => {
          this.addEjercicio(
            ejercicio.ejercicioId!,
            ejercicio.series ?? 3,
            ejercicio.repeticiones ?? 10,
            ejercicio.pesoEjercicio ?? null
          );
        });
      }
      
    } catch (error) {
      console.error('Error cargando rutina:', error);
      throw error;
    }
  }

  addEjercicio(ejercicioId?: number, series: number = 3, repeticiones: number = 10, peso?: number | null): void {
    const ejercicioGroup = this.fb.group({
      ejercicioId: [ejercicioId || '', [Validators.required, Validators.min(1)]],
      series: [series, [Validators.required, Validators.min(1), Validators.max(50)]],
      repeticiones: [repeticiones, [Validators.required, Validators.min(1), Validators.max(1000)]],
      pesoEjercicio: [peso, [Validators.min(0), Validators.max(1000)]]
    });
    
    this.ejerciciosFormArray.push(ejercicioGroup);
  }

  removeEjercicio(index: number): void {
    if (index >= 0 && index < this.ejerciciosFormArray.length) {
      this.ejerciciosFormArray.removeAt(index);
    }
  }

  // FIXED: More robust parsing function
  private parseClienteId(value: any): number | null {
    console.log('Parsing clienteId:', value, 'type:', typeof value);
    
    // Handle null, undefined, empty string cases
    if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
      console.log('Value is null/undefined/empty, returning null');
      return null;
    }
    
    // If already a number, validate it
    if (typeof value === 'number') {
      const result = value > 0 ? value : null;
      console.log('Value is number, result:', result);
      return result;
    }
    
    // If string, try to parse
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') {
        console.log('Trimmed string is empty, returning null');
        return null;
      }
      
      const parsed = parseInt(trimmed, 10);
      const result = (!isNaN(parsed) && parsed > 0) ? parsed : null;
      console.log('Parsed string:', trimmed, 'result:', result);
      return result;
    }
    
    console.log('Unknown value type, returning null');
    return null;
  }

  onSubmit(): void {
    console.log('=== INICIANDO ENVÍO DE FORMULARIO ===');
    console.log('Form value:', this.rutinaForm.value);
    console.log('Form valid:', this.rutinaForm.valid);
    console.log('ClienteId raw:', this.rutinaForm.get('clienteId')?.value);

    if (this.isSubmitting) {
      console.log('Ya se está procesando el envío');
      return;
    }

    // Validar formulario
    if (this.rutinaForm.invalid) {
      console.log('Formulario inválido:', this.getFormErrors());
      this.markFormGroupTouched();
      this.showFormErrors();
      return;
    }

    // Validar clienteId específicamente
    const clienteIdValue = this.rutinaForm.get('clienteId')?.value;
    const parsedClienteId = this.parseClienteId(clienteIdValue);
    console.log('ClienteId validation:', {
      raw: clienteIdValue,
      parsed: parsedClienteId,
      usuariosCount: this.usuarios.length
    });

    if (!parsedClienteId || parsedClienteId <= 0) {
      alert('Debe seleccionar un cliente válido');
      return;
    }

    // Verificar que el cliente existe en la lista
    const clienteExiste = this.usuarios.some(u => u.id === parsedClienteId);
    if (!clienteExiste) {
      alert('El cliente seleccionado no es válido');
      console.log('Cliente no encontrado. Clientes disponibles:', this.usuarios.map(u => ({id: u.id, nombre: u.nombre})));
      return;
    }

    // Validar ejercicios
    if (this.ejerciciosFormArray.length === 0) {
      alert('Debe agregar al menos un ejercicio a la rutina');
      return;
    }

    // Validar ejercicios individuales
    const ejerciciosInvalidos = this.validateEjercicios();
    if (ejerciciosInvalidos.length > 0) {
      alert(`Ejercicios inválidos en las posiciones: ${ejerciciosInvalidos.join(', ')}`);
      return;
    }

    console.log('Todas las validaciones pasaron, procesando envío...');
    this.processSubmit();
  }

  private validateEjercicios(): number[] {
    const invalidIndexes: number[] = [];
    
    this.ejerciciosFormArray.controls.forEach((control, index) => {
      const ejercicio = control.value;
      
      if (!ejercicio.ejercicioId || ejercicio.ejercicioId <= 0) {
        invalidIndexes.push(index + 1);
        return;
      }
      
      if (!ejercicio.series || ejercicio.series <= 0 || ejercicio.series > 50) {
        invalidIndexes.push(index + 1);
        return;
      }
      
      if (!ejercicio.repeticiones || ejercicio.repeticiones <= 0 || ejercicio.repeticiones > 1000) {
        invalidIndexes.push(index + 1);
        return;
      }
      
      if (ejercicio.pesoEjercicio !== null && ejercicio.pesoEjercicio !== '' && 
          (ejercicio.pesoEjercicio < 0 || ejercicio.pesoEjercicio > 1000)) {
        invalidIndexes.push(index + 1);
        return;
      }
    });
    
    return invalidIndexes;
  }

  private async processSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      
      const rutinaData = this.buildRutinaData();
      console.log('=== DATOS FINALES PARA ENVÍO ===');
      console.log('Rutina data:', JSON.stringify(rutinaData, null, 2));
      
      let result;
      if (this.isEditMode && this.rutinaId) {
        result = await lastValueFrom(this.rutinaService.updateRutina(this.rutinaId, rutinaData));
      } else {
        result = await lastValueFrom(this.rutinaService.createRutina(rutinaData));
      }
      
      console.log('Resultado exitoso:', result);
      this.showSuccessMessage();
      
      // Navegar después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/entrenador/rutinas']);
      }, 1500);
      
    } catch (error) {
      console.error('Error detallado en submit:', error);
      this.handleSubmitError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  // FIXED: Enhanced buildRutinaData with better validation and logging
  private buildRutinaData(): Rutina {
    const formValue = this.rutinaForm.value;
    const clienteId = this.parseClienteId(formValue.clienteId);
    const entrenadorId = this.authService.getCurrentUserId();

    console.log('=== BUILDING RUTINA DATA ===');
    console.log('Form value:', formValue);
    console.log('Parsed clienteId:', clienteId);
    console.log('EntrenadorId:', entrenadorId);

    // Validaciones críticas
    if (!clienteId || clienteId <= 0) {
      console.error('ClienteId is invalid:', clienteId);
      throw new Error('Cliente ID es requerido y debe ser un número válido');
    }

    if (!entrenadorId || entrenadorId <= 0) {
      console.error('EntrenadorId is invalid:', entrenadorId);
      throw new Error('No se pudo obtener el ID del entrenador');
    }

    // Verificar que el cliente existe
    const clienteExiste = this.usuarios.some(u => u.id === clienteId);
    if (!clienteExiste) {
      console.error('Cliente no existe:', clienteId, 'Available clients:', this.usuarios);
      throw new Error(`El cliente seleccionado no es válido (ID: ${clienteId})`);
    }

    // Construir ejercicios con validación
    const ejercicios: RutinaEjercicio[] = formValue.ejercicios.map((ej: any, index: number) => {
      const ejercicioId = parseInt(ej.ejercicioId, 10);
      const series = parseInt(ej.series, 10);
      const repeticiones = parseInt(ej.repeticiones, 10);
      
      if (isNaN(ejercicioId) || ejercicioId <= 0) {
        throw new Error(`Ejercicio ${index + 1}: ID de ejercicio inválido`);
      }
      
      if (isNaN(series) || series <= 0) {
        throw new Error(`Ejercicio ${index + 1}: Número de series inválido`);
      }
      
      if (isNaN(repeticiones) || repeticiones <= 0) {
        throw new Error(`Ejercicio ${index + 1}: Número de repeticiones inválido`);
      }

      let pesoEjercicio: number | null = null;
      if (ej.pesoEjercicio !== null && ej.pesoEjercicio !== '' && ej.pesoEjercicio !== undefined) {
        pesoEjercicio = parseFloat(ej.pesoEjercicio);
        if (isNaN(pesoEjercicio) || pesoEjercicio < 0) {
          throw new Error(`Ejercicio ${index + 1}: Peso inválido`);
        }
      }

      return {
        ejercicioId,
        series,
        repeticiones,
        pesoEjercicio
      };
    });

    // FIXED: Build rutina object with correct field names
    const rutina: Rutina = {
      descripcion: formValue.descripcion?.trim() || '',
      usuarioId: clienteId,     // This is the correct field name for the backend
      entrenadorId: entrenadorId,
      ejercicios: ejercicios,
      activa: true
    };

    console.log('Final rutina object:', rutina);
    return rutina;
  }

  private showSuccessMessage(): void {
    const message = this.isEditMode ? 'Rutina actualizada correctamente' : 'Rutina creada correctamente';
    
    // Intentar mostrar toast de Bootstrap si existe
    const toastElement = document.getElementById('successToast');
    if (toastElement && (window as any).bootstrap) {
      new (window as any).bootstrap.Toast(toastElement).show();
    } else {
      alert(message);
    }
  }

  private handleSubmitError(error: any): void {
    let message = 'Error al procesar la rutina';
    
    if (error?.error) {
      if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.error.message) {
        message = error.error.message;
      } else if (error.error.error) {
        message = error.error.error;
      }
    } else if (error?.message) {
      message = error.message;
    }
    
    console.error('Error completo:', error);
    alert(`Error: ${message}`);
  }

  private showFormErrors(): void {
    const errors = this.getFormErrors();
    const messages: string[] = [];
    
    if (errors.clienteId?.clienteRequired) messages.push('• Debe seleccionar un cliente');
    if (errors.clienteId?.clienteNoExiste) messages.push('• El cliente seleccionado no existe');
    if (errors.descripcion?.required) messages.push('• La descripción es obligatoria');
    if (errors.descripcion?.maxlength) messages.push('• La descripción es demasiado larga');
    
    // Validar errores en ejercicios
    this.ejerciciosFormArray.controls.forEach((control, index) => {
      const ejercicioErrors = control.errors;
      if (ejercicioErrors) {
        messages.push(`• Ejercicio ${index + 1}: tiene errores`);
      }
    });
    
    if (messages.length > 0) {
      alert('Corrija los siguientes errores:\n\n' + messages.join('\n'));
    }
  }

  private getFormErrors(): any {
    const formErrors: any = {};

    Object.keys(this.rutinaForm.controls).forEach(key => {
      const control = this.rutinaForm.get(key);
      if (control?.errors) {
        formErrors[key] = control.errors;
      }
    });

    return formErrors;
  }

  private markFormGroupTouched(): void {
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

  cancelar(): void {
    if (confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/entrenador/rutinas']);
    }
  }

  // Métodos públicos para el template
  agregarEjercicio = () => this.addEjercicio();
  eliminarEjercicio = (index: number) => this.removeEjercicio(index);
}