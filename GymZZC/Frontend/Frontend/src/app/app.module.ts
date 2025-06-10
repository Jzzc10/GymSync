import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';
import { DashboardEntrenadorComponent } from './components/dashboard-entrenador/dashboard-entrenador.component';
import { HeaderComponent } from './components/header/header.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { TemporizadorComponent } from './components/temporizador/temporizador.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    DashboardClienteComponent,
    DashboardEntrenadorComponent,
    HeaderComponent,
    EstadisticasComponent,
    TemporizadorComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent] // Achivo de arranque de la aplicación
})
export class AppModule {}