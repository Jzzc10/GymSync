import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  returnUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    console.log('🚀 LoginComponent inicializado');
    
    // Obtener URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    console.log('🎯 URL de retorno:', this.returnUrl);
    
    // Si ya está logueado, redirigir inmediatamente
    if (this.authService.isLoggedIn()) {
      console.log('👤 Usuario ya logueado, redirigiendo...');
      this.redirectUser();
    }
  }
  
  private redirectUser(): void {
    const role = this.authService.getUserRole();
    console.log('🎭 Redirigiendo usuario con rol:', role);
    
    // Si hay URL de retorno y es válida, usarla
    if (this.returnUrl && this.isValidReturnUrl(this.returnUrl)) {
      console.log('↩️ Redirigiendo a URL de retorno:', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
      return;
    }
    
    // Redirección por defecto según rol
    const dashboardRoute = this.getDashboardRoute(role);
    console.log('🏠 Redirigiendo a dashboard:', dashboardRoute);
    
    // Usar navigateByUrl para evitar problemas de navegación
    this.router.navigateByUrl(dashboardRoute);
  }
  
  private isValidReturnUrl(url: string): boolean {
    // Validar que la URL de retorno sea segura y corresponda al rol del usuario
    const role = this.authService.getUserRole();
    
    if (!role) return false;
    
    // URLs válidas por rol
    const validUrls: { [key: string]: string[] } = {
      'CLIENTE': ['/dashboard-cliente', '/estadisticas', '/temporizador', '/perfil'],
      'ENTRENADOR': ['/dashboard-entrenador', '/entrenador/usuarios', '/entrenador/rutinas', '/entrenador/ejercicios', '/perfil'],
      'ADMIN': ['/dashboard-admin', '/admin/usuarios', '/admin/entrenadores', '/perfil']
    };
    
    const allowedUrls = validUrls[role] || [];
    return allowedUrls.some(allowedUrl => url.startsWith(allowedUrl));
  }
  
  private getDashboardRoute(role: string | null): string {
    switch(role) {
      case 'CLIENTE': return '/dashboard-cliente';
      case 'ENTRENADOR': return '/dashboard-entrenador';
      case 'ADMIN': return '/dashboard-admin';
      default: return '/login';
    }
  }

  onSubmit() {
    console.log('📝 Formulario enviado');
    
    if (this.loginForm.invalid) {
      console.log('❌ Formulario inválido');
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.clearErrors(); // Limpiar errores previos
    
    const { rol, email, password } = this.loginForm.value;
    console.log('🔐 Intentando login:', { rol, email, password: '***' });
    
    this.authService.loginWithRole({ email, password }, rol).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response.usuario.email);
        this.loading = false;
        
        // Pequeña demora para asegurar que el estado se actualice
        setTimeout(() => {
          this.redirectUser();
        }, 100);
      },
      error: (err) => {
        this.loading = false;
        console.error('💥 Error en login:', err);
        this.handleLoginError(err);
      }
    });
  }
  
  private clearErrors(): void {
    // Limpiar errores previos del formulario
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control?.errors?.['serverError']) {
        delete control.errors['serverError'];
        if (Object.keys(control.errors).length === 0) {
          control.setErrors(null);
        }
      }
    });
  }
  
  private handleLoginError(err: any): void {
    if (err.message && err.message.includes('Rol incorrecto')) {
      this.loginForm.get('rol')?.setErrors({ serverError: 'No existe cuenta con este rol' });
    } else if (err.status === 401) {
      this.loginForm.get('password')?.setErrors({ serverError: 'Email o contraseña incorrectos' });
    } else if (err.status === 0) {
      this.loginForm.get('email')?.setErrors({ serverError: 'No se puede conectar con el servidor' });
    } else {
      this.loginForm.get('email')?.setErrors({ 
        serverError: err.message || 'Error al iniciar sesión. Inténtalo de nuevo.' 
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

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