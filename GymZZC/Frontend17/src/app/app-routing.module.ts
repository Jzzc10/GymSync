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
  
  // RUTAS DE ENTRENADOR - Página principal
  { 
    path: 'dashboard-entrenador', 
    component: DashboardEntrenadorComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' } 
  },
  
  // RUTAS DE ENTRENADOR - Módulos específicos (Lazy Loading)
  {
    path: 'entrenador',
    loadChildren: () => import('./components/dashboard-entrenador/dashboard-entrenador.module')
      .then(m => m.DashboardEntrenadorModule),
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
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
  
  // PERFIL - Accesible para todos los roles autenticados
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
    enableTracing: false, // Cambiar a true solo para debug
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }