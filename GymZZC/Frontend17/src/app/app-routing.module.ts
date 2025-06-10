import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';
import { DashboardEntrenadorComponent } from './components/dashboard-entrenador/dashboard-entrenador.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { TemporizadorComponent } from './components/temporizador/temporizador.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas por AuthGuard
  { path: 'dashboard-cliente', component: DashboardClienteComponent, canActivate: [AuthGuard] },
  { path: 'dashboard-entrenador', component: DashboardEntrenadorComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: DashboardAdminComponent, canActivate: [AuthGuard] },
  
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [AuthGuard] },
  { path: 'temporizador', component: TemporizadorComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }