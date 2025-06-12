import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  roles = ['CLIENTE', 'ENTRENADOR', 'ADMIN'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    console.log('LoginComponent inicializado');
    // Si ya está logueado, redirigir
    if (this.authService.isLoggedIn()) {
      console.log('Usuario ya logueado, redirigiendo...');
      this.redirectBasedOnRole();
    }
  }
  
  private redirectBasedOnRole() {
    const role = this.authService.getUserRole();
    console.log('Redirigiendo basado en rol:', role);
    
    // Usar setTimeout para asegurar que la navegación ocurra después del ciclo actual
    setTimeout(() => {
      switch(role) {
        case 'CLIENTE': 
          console.log('Navegando a dashboard-cliente');
          this.router.navigate(['/dashboard-cliente']); 
          break;
        case 'ENTRENADOR': 
          console.log('Navegando a dashboard-entrenador');
          this.router.navigate(['/dashboard-entrenador']); 
          break;
        case 'ADMIN': 
          console.log('Navegando a dashboard-admin');
          this.router.navigate(['/dashboard-admin']);
          break;
        default: 
          console.log('Rol desconocido, navegando a login:', role);
          this.router.navigate(['/login']);
      }
    }, 100);
  }

  onSubmit() {
    console.log('Formulario enviado');
    
    if (this.loginForm.invalid) {
      console.log('Formulario inválido, marcando campos como tocados');
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    
    const { rol, email, password } = this.loginForm.value;
    console.log('Intentando login con:', { rol, email, password: '***' });
    
    this.authService.loginWithRole({ email, password }, rol).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.loading = false;
        
        // Verificar que el estado de autenticación se haya actualizado
        console.log('Estado después del login:');
        console.log('- isLoggedIn:', this.authService.isLoggedIn());
        console.log('- userRole:', this.authService.getUserRole());
        console.log('- currentUser:', this.authService.getCurrentUser());
        
        // Usar setTimeout para dar tiempo a que se actualice el estado
        setTimeout(() => {
          this.redirectBasedOnRole();
        }, 200);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en login:', err);
        
        // Manejo de errores del servidor
        if (err.message && err.message.includes('Rol incorrecto')) {
          this.loginForm.get('rol')?.setErrors({ serverError: 'No existe cuenta con este rol' });
        } else if (err.status === 401) {
          this.loginForm.get('password')?.setErrors({ serverError: 'Email o contraseña incorrectos' });
        } else if (err.status === 0) {
          this.loginForm.get('email')?.setErrors({ serverError: 'No se puede conectar con el servidor' });
        } else {
          this.loginForm.get('email')?.setErrors({ serverError: err.message || 'Error al iniciar sesión. Inténtalo de nuevo.' });
        }
      }
    });
  }

  // Método para marcar campos como tocados y mostrar errores
  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos para mostrar errores específicos en el template
  getEmailError(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.errors && emailControl.touched) {
      if (emailControl.errors['required']) return 'El email es requerido';
      if (emailControl.errors['email']) return 'Ingresa un email válido';
      if (emailControl.errors['serverError']) return emailControl.errors['serverError'];
    }
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.errors && passwordControl.touched) {
      if (passwordControl.errors['required']) return 'La contraseña es requerida';
      if (passwordControl.errors['minlength']) return 'La contraseña debe tener al menos 6 caracteres';
      if (passwordControl.errors['serverError']) return passwordControl.errors['serverError'];
    }
    return '';
  }

  getRolError(): string {
    const rolControl = this.loginForm.get('rol');
    if (rolControl?.errors && rolControl.touched) {
      if (rolControl.errors['required']) return 'Debes seleccionar un rol';
      if (rolControl.errors['serverError']) return rolControl.errors['serverError'];
    }
    return '';
  }
}