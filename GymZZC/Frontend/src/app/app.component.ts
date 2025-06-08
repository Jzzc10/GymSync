// app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component'; // Ajusta la ruta
import { ExerciseFormComponent } from './exercise-form/exercise-form.component'; // Ajusta la ruta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // 👇 Agrega los componentes aquí
    HeaderComponent,
    ExerciseFormComponent
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'gym-progress';
}