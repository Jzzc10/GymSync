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
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  private redirectBasedOnRole() {
    const role = this.authService.getUserRole();
    switch(role) {
      case 'CLIENTE': 
        this.router.navigate(['/dashboard-cliente']); 
        break;
      case 'ENTRENADOR': 
        this.router.navigate(['/dashboard-entrenador']); 
        break;
      case 'ADMIN': 
        this.router.navigate(['/admin']); 
        break;
      default: 
        this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const { rol, email, password } = this.loginForm.value;
    
    // SOLUCIÓN: Remover la llamada duplicada
    this.authService.loginWithRole({ email, password }, rol).subscribe({
      next: () => {
        this.loading = false;
        // SOLUCIÓN: Usar la función de redirección centralizada
        this.redirectBasedOnRole();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Credenciales incorrectas o rol no coincide';
      }
    });
  }
}