import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DashboardEntrenadorComponent } from './dashboard-entrenador.component';
import { RutinaFormComponent } from './rutinas/rutina-form/rutina-form.component';
import { RutinaDetalleComponent } from './rutinas/rutina-detalle/rutina-detalle.component';
import { RutinasComponent } from './rutinas/rutinas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  declarations: [
    DashboardEntrenadorComponent,
    RutinaFormComponent,
    RutinaDetalleComponent,
    RutinasComponent,
    UsuariosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DashboardEntrenadorComponent,
  ]
})
export class DashboardEntrenadorModule { }