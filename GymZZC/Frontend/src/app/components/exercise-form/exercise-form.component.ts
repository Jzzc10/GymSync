import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface Exercise {
  id: number;
  nombre: string;
  ejercicio: string;
  repeticiones: number;
  series: number;
  fecha: Date;
}

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent {
  selectedExercise: string = '';
  selectedRepetitions: number = 0;
  selectedSeries: number = 0;
  
  registeredExercises: Exercise[] = [];

  ejercicios = [
    'Press de banca',
    'Sentadillas',
    'Peso muerto',
    'Press militar',
    'Remo con barra',
    'Dominadas',
    'Fondos',
    'Curl de bíceps',
    'Extensiones de tríceps',
    'Elevaciones laterales',
    'Prensa de piernas',
    'Curl de piernas',
    'Extensiones de cuádriceps',
    'Elevaciones de gemelos',
    'Abdominales'
  ];

  repeticiones = [5, 6, 8, 10, 12, 15, 20, 25, 30];
  series = [1, 2, 3, 4, 5, 6];

  registrarEjercicio() {
    if (this.selectedExercise && this.selectedRepetitions > 0 && this.selectedSeries > 0) {
      const nuevoEjercicio: Exercise = {
        id: Date.now(),
        nombre: this.selectedExercise,
        ejercicio: this.selectedExercise,
        repeticiones: this.selectedRepetitions,
        series: this.selectedSeries,
        fecha: new Date()
      };

      this.registeredExercises.unshift(nuevoEjercicio);
      
      // Limpiar formulario
      this.selectedExercise = '';
      this.selectedRepetitions = 0;
      this.selectedSeries = 0;

      console.log('Ejercicio registrado:', nuevoEjercicio);
    } else {
      alert('Por favor, completa todos los campos');
    }
  }

  eliminarEjercicio(id: number) {
    this.registeredExercises = this.registeredExercises.filter(exercise => exercise.id !== id);
  }
}