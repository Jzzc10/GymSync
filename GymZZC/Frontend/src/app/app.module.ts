// src/app/app.module.ts
import { HeaderComponent } from './header/header.component';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'; // Si necesitas HTTP
import { AuthService } from './auth.service'; // El servicio se auto-registra con providedIn: 'root'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,        // Add here
    ExerciseFormComponent   // Add here
  ],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule { }