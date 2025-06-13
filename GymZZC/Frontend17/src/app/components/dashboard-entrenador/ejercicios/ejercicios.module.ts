import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EjercicioRoutingModule } from './ejercicios-routing.module';
import { EjercicioListComponent } from './ejercicios-list/ejercicios-list.component';
import { EjercicioFormComponent } from './ejercicios-form/ejercicio-form.component';

@NgModule({
  declarations: [
    EjercicioListComponent,
    EjercicioFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EjercicioRoutingModule,
  ]
})
export class EjerciciosModule { }