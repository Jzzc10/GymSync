import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { TemporizadorComponent } from './components/temporizador/temporizador.component';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
  { path: '', component: DashboardClienteComponent }, // Tu componente principal
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: 'temporizador', component: TemporizadorComponent },
  { path: 'usuarios', component: PerfilComponent },
  { path: '**', redirectTo: '' } // Redirección para rutas no encontradas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
