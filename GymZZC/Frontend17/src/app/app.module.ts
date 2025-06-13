import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardClienteComponent } from './components/dashboard-cliente/dashboard-cliente.component';
import { HeaderComponent } from './components/header/header.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { EstadisticasComponent } from './components/dashboard-cliente/estadisticas/estadisticas.component';
import { TemporizadorComponent } from './components/dashboard-cliente/temporizador/temporizador.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderByPipe } from './pipes/order-by.pipe';
import { MadridTimePipe } from './pipes/madridTime.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GestionUsuariosComponent } from './components/dashboard-admin/gestion-usuarios/gestion-usuarios.component';
import { GestionEntrenadoresComponent } from './components/dashboard-admin/gestion-entrenadores/gestion-entrenadores.component';
import { UsuarioFormComponent } from './components/dashboard-admin/gestion-usuarios/usuario-form/usuario-form.component';

// Import dashboard-entrenador components directly
import { DashboardEntrenadorComponent } from './components/dashboard-entrenador/dashboard-entrenador.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardClienteComponent,
    HeaderComponent,
    EstadisticasComponent,
    TemporizadorComponent,
    PerfilComponent,
    LoginComponent,
    DashboardAdminComponent,
    OrderByPipe,
    MadridTimePipe,
    GestionUsuariosComponent,
    GestionEntrenadoresComponent,
    UsuarioFormComponent,
    DashboardEntrenadorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule,
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}