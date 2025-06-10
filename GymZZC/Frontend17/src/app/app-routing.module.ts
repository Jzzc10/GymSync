import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';
import { DashboardEntrenadorComponent } from './components/dashboard-entrenador/dashboard-entrenador.component';
import { EstadisticasComponent } from './components/dashboard-cliente/estadisticas/estadisticas.component';
import { TemporizadorComponent } from './components/dashboard-cliente/temporizador/temporizador.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { EjerciciosEntrenadorComponent } from './components/dashboard-entrenador/ejercicios-entrenador/ejercicios-entrenador.component';
import { ProgresosUsuariosComponent } from './components/dashboard-entrenador/usuarios-entrenador/progresos-usuarios/progresos-usuarios.component';
import { RutinasEntrenadorComponent } from './components/dashboard-entrenador/rutinas-entrenador/rutinas-entrenador.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Ruta para el login
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas por AuthGuard y por rol
  { path: 'dashboard-cliente', component: DashboardClienteComponent, 
    canActivate: [AuthGuard],
    data: { role: 'CLIENTE' } 
  },

  { path: 'dashboard-entrenador', component: DashboardEntrenadorComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' } 
  },

  { path: 'dashboard-admin', component: DashboardAdminComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' } 
  },
  
  { path: 'estadisticas', component: EstadisticasComponent, 
    canActivate: [AuthGuard],
    data: { role: 'CLIENTE' } 
  },

  { path: 'temporizador', component: TemporizadorComponent, 
    canActivate: [AuthGuard],
    data: { role: 'CLIENTE' } 
  },

  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },

  { 
    path: 'entrenador/rutinas', 
    component: RutinasEntrenadorComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  
  { 
    path: 'entrenador/ejercicios', 
    component: EjerciciosEntrenadorComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  { 
    path: 'entrenador/progresos', 
    component: ProgresosUsuariosComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }