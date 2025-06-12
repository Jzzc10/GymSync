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

import { UsuariosComponent } from './components/dashboard-entrenador/usuarios/usuarios.component';
import { RutinasComponent } from './components/dashboard-entrenador/rutinas/rutinas.component';

import { GestionUsuariosComponent } from './components/dashboard-admin/gestion-usuarios/gestion-usuarios.component';
import { GestionEntrenadoresComponent } from './components/dashboard-admin/gestion-entrenadores/gestion-entrenadores.component';

import { Permission } from './models/auth.model';

import { RutinaFormComponent } from './components/dashboard-entrenador/rutinas/rutina-form/rutina-form.component';
import { RutinaDetalleComponent } from './components/dashboard-entrenador/rutinas/rutina-detalle/rutina-detalle.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
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
  
  { 
    path: 'dashboard-entrenador', 
    component: DashboardEntrenadorComponent, 
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' } 
  },
  
  // RUTAS DE USUARIOS ENTRENADOR
  { 
    path: 'entrenador/usuarios', 
    component: UsuariosComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      requiredPermissions: [Permission.VIEW_USERS, Permission.VIEW_PROGRESS] 
    }
  },
  
  // RUTAS DE RUTINAS ENTRENADOR
  {
    path: 'entrenador/rutinas',
    component: RutinasComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.VIEW_ROUTINES]
    }
  },
  {
    path: 'entrenador/rutinas/crear',
    component: RutinaFormComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.CREATE_ROUTINE]
    }
  },
  {
    path: 'entrenador/rutinas/editar/:id',
    component: RutinaFormComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.EDIT_ROUTINE]
    }
  },
  {
    path: 'entrenador/rutinas/:id',
    component: RutinaDetalleComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.VIEW_ROUTINES]
    }
  },
  
  // RUTAS DE EJERCICIOS ENTRENADOR (Lazy Loading)
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

  // RUTAS ADICIONALES QUE FALTAN PARA USUARIOS (necesitas crear estos componentes)
  // Comentadas hasta que crees los componentes correspondientes
  /*
  {
    path: 'dashboard-entrenador/asignar-usuario',
    component: AsignarUsuarioComponent, // Necesitas crear este componente
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  {
    path: 'dashboard-entrenador/usuario-detalle/:id',
    component: UsuarioDetalleComponent, // Necesitas crear este componente
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  {
    path: 'dashboard-entrenador/asignar-rutina/:id',
    component: AsignarRutinaComponent, // Necesitas crear este componente
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  {
    path: 'dashboard-entrenador/progreso-usuario/:id',
    component: ProgresoUsuarioComponent, // Necesitas crear este componente
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  */

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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }