// src/app/app.module.ts
import { HeaderComponent } from './components/header/header.component';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';


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