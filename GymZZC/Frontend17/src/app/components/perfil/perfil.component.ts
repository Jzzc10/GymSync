import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
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

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    const updatedData = {
      ...this.profileForm.value,
      rol: this.currentUser.rol  // Incluir rol requerido
    };

    // CORRECCIÓN: Usar updateUsuario en lugar de updateUser
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
        // Manejo mejorado de errores
        const errorMessage = err.error?.message || 'Ocurrió un error al actualizar el perfil';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordLoading = true;
    const passwordData = {
      nuevaPassword: this.passwordForm.value.newPassword
    };

    this.usuarioService.cambiarPassword(
      this.currentUser.id, 
      passwordData
    ).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', {
          duration: 3000
        });
        this.passwordLoading = false;
        this.passwordForm.reset();
        this.showPasswordForm = false;
      },
      error: (err) => {
        // CORRECCIÓN: Acceso correcto al mensaje de error
        const errorMessage = err.error?.message || 'Ocurrió un error al cambiar la contraseña';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000
        });
        this.passwordLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}