import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';
import { DashboardEntrenadorComponent } from './components/dashboard-entrenador/dashboard-entrenador.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { EstadisticasComponent } from './components/dashboard-cliente/estadisticas/estadisticas.component';
import { TemporizadorComponent } from './components/dashboard-cliente/temporizador/temporizador.component';

import { GestionUsuariosComponent } from './components/dashboard-admin/gestion-usuarios/gestion-usuarios.component';
import { GestionEntrenadoresComponent } from './components/dashboard-admin/gestion-entrenadores/gestion-entrenadores.component';

import { Permission } from './models/auth.model';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // RUTAS DE CLIENTE
  { 
    path: 'dashboard-cliente', 
    component: DashboardClienteComponent, 
    canActivate: [AuthGuard],
    data: { role: 'CLIENTE' }
  },
  { 
    path: 'estadisticas', 
    component: EstadisticasComponent, 
    canActivate: [AuthGuard],
    data: { role: 'CLIENTE' } 
  },
  { 
    path: 'temporizador', 
    component: TemporizadorComponent, 
    canActivate: [AuthGuard],
    data: { role: 'CLIENTE' } 
  },
  
  // RUTAS DE ENTRENADOR
  { 
    path: 'dashboard-entrenador', 
    component: DashboardEntrenadorComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' } 
  },
  
  // IMPORTANTE: Estas rutas DEBEN coincidir con los routerLink del dashboard-entrenador.component.ts
  {
    path: 'entrenador/usuarios',
    loadChildren: () => import('./components/dashboard-entrenador/dashboard-entrenador.module')
      .then(m => m.DashboardEntrenadorModule),
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      requiredPermissions: [Permission.VIEW_USERS, Permission.VIEW_PROGRESS]
    }
  },

  {
    path: 'entrenador/ejercicios',
    loadChildren: () => import('./components/dashboard-entrenador/ejercicios/ejercicios.module')
      .then(m => m.EjerciciosModule),
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [
        Permission.VIEW_EXERCISES,
        Permission.CREATE_EXERCISE,
        Permission.EDIT_EXERCISE,
        Permission.DELETE_EXERCISE
      ]
    }
  },

  {
    path: 'entrenador/rutinas',
    loadChildren: () => import('./components/dashboard-entrenador/dashboard-entrenador.module')
      .then(m => m.DashboardEntrenadorModule),
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.VIEW_ROUTINES]
    }
  },

  // RUTAS ADMIN
  { 
    path: 'dashboard-admin', 
    component: DashboardAdminComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/usuarios', 
    component: GestionUsuariosComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/entrenadores', 
    component: GestionEntrenadoresComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' } 
  },
  
  { 
    path: 'perfil', 
    component: PerfilComponent, 
    canActivate: [AuthGuard] 
  },

  // Ruta wildcard - va al final
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // IMPORTANTE: Estas opciones pueden ayudar con problemas de navegación
    enableTracing: false, // Cambiar a true solo para debugging
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }