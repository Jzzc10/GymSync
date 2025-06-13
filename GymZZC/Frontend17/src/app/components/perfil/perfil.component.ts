import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PasswordChangeRequest, UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any;
  loading = false;
  passwordLoading = false;
  showPasswordForm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    
    this.profileForm = this.fb.nonNullable.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.nonNullable.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        nombre: this.currentUser.nombre,
        email: this.currentUser.email
      });
    }
  }

  passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (!newPassword || !confirmPassword) {
      return null;
    }
    
    // Solo verificar que las nuevas contraseñas coincidan
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
  
  
  async changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordLoading = true;
    const { currentPassword, newPassword } = this.passwordForm.value;
    
    try {
      // Verificar contraseña sin enviar rol
      const isValid = await firstValueFrom(this.authService.verifyPassword({
        email: this.currentUser.email,
        password: currentPassword
      }));

      if (!isValid) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Enviar ambos campos como requiere el backend
      await firstValueFrom(this.usuarioService.cambiarPassword(
        this.currentUser.id, 
        { 
          currentPassword: currentPassword, 
          nuevaPassword: newPassword 
        }
      ));
      
      this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
      this.passwordForm.reset();
      this.showPasswordForm = false;
    } catch (error: unknown) {
      const err = error as {message?: string, error?: {message?: string}};
      const message = err?.error?.message || err?.message || 'Error al cambiar la contraseña';
      
      if (message.includes('contraseña actual')) {
        this.passwordForm.get('currentPassword')?.setErrors({ incorrect: true });
      }
      
      this.snackBar.open(message, 'Cerrar', { duration: 3000 });
    } finally {
      this.passwordLoading = false;
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const updatedData = {
      ...this.profileForm.value,
      rol: this.currentUser.rol
    };

    this.usuarioService.updateUsuario(this.currentUser.id, updatedData).subscribe({
      next: (updatedUser) => {
        this.authService.updateUserProfile(updatedUser);
        this.currentUser = updatedUser;
        
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Ocurrió un error al actualizar el perfil';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Métodos helper para validaciones
  hasError(formName: 'profile' | 'password', fieldName: string, errorType: string): boolean {
    const form = formName === 'profile' ? this.profileForm : this.passwordForm;
    const field = form.get(fieldName);
    return !!(field?.errors?.[errorType] && field?.touched);
  }

  hasFormError(errorType: string): boolean {
    return !!(this.passwordForm.errors?.[errorType] && 
             this.passwordForm.get('confirmPassword')?.touched);
  }

  isFieldInvalid(formName: 'profile' | 'password', fieldName: string): boolean {
    const form = formName === 'profile' ? this.profileForm : this.passwordForm;
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}