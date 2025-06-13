import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EjercicioListComponent } from './ejercicios-list/ejercicios-list.component';
import { EjercicioFormComponent } from './ejercicios-form/ejercicio-form.component';

const routes: Routes = [
  { path: '', component: EjercicioListComponent },
  { path: 'nuevo', component: EjercicioFormComponent },
  { path: 'editar/:id', component: EjercicioFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjercicioRoutingModule { }