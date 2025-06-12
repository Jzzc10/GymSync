import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RutinaFormComponent } from './rutinas/rutina-form/rutina-form.component';
import { RutinaDetalleComponent } from './rutinas/rutina-detalle/rutina-detalle.component';
import { RutinasComponent } from './rutinas/rutinas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  // Ruta base redirige a usuarios
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  
  // Gestión de usuarios/clientes
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  
  // Gestión de rutinas
  {
    path: 'rutinas',
    component: RutinasComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  {
    path: 'rutinas/crear',
    component: RutinaFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  {
    path: 'rutinas/editar/:id',
    component: RutinaFormComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  {
    path: 'rutinas/:id',
    component: RutinaDetalleComponent,
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  },
  
  // Lazy loading para ejercicios
  {
    path: 'ejercicios',
    loadChildren: () => import('./ejercicios/ejercicios.module')
      .then(m => m.EjerciciosModule),
    canActivate: [AuthGuard],
    data: { role: 'ENTRENADOR' }
  }
];

@NgModule({
  declarations: [
    RutinaFormComponent,
    RutinaDetalleComponent,
    RutinasComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DashboardEntrenadorModule { }