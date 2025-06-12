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

import { Permission } from '../../models/auth.model';
import { AuthGuard } from '../../guards/auth.guard';

// RUTAS CHILD - estas se cargan cuando se accede a /entrenador/*
const routes: Routes = [
  {
    path: 'usuarios', // Se accede como /entrenador/usuarios
    component: UsuariosComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      requiredPermissions: [Permission.VIEW_USERS, Permission.VIEW_PROGRESS] 
    }
  },
  {
    path: 'rutinas', // Se accede como /entrenador/rutinas
    component: RutinasComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.VIEW_ROUTINES]
    }
  },
  {
    path: 'rutinas/crear',
    component: RutinaFormComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.CREATE_ROUTINE]
    }
  },
  {
    path: 'rutinas/editar/:id',
    component: RutinaFormComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.EDIT_ROUTINE]
    }
  },
  {
    path: 'rutinas/:id',
    component: RutinaDetalleComponent,
    canActivate: [AuthGuard],
    data: { 
      role: 'ENTRENADOR',
      permissions: [Permission.VIEW_ROUTINES]
    }
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