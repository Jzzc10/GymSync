// app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component'; // Ajusta la ruta
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component'; // Ajusta la ruta

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