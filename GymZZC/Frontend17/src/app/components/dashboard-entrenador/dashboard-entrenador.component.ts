// src/app/components/dashboard-entrenador/dashboard-entrenador.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'dashboard-entrenador',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <a class="dashboard-card" routerLink="/entrenador/ejercicios">
        <div 
          class="card-bg" 
          style="background-image: url('assets/fotos/ejercicios.jpg')">
        </div>
        <div class="overlay"></div>
        <h2>EJERCICIOS</h2>
      </a>
      
      <a class="dashboard-card" routerLink="/entrenador/rutinas">
        <div 
          class="card-bg" 
          style="background-image: url('assets/fotos/rutinas.jpg')">
        </div>
        <div class="overlay"></div>
        <h2>RUTINAS</h2>
      </a>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .dashboard-card {
      flex: 1;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      transition: all 0.5s ease;
      text-decoration: none;
      cursor: pointer;
    }

    .dashboard-card:hover {
      flex: 1.5;
    }

    .dashboard-card:hover .card-bg {
      transform: scale(1.05);
    }

    .dashboard-card .card-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      transition: transform 0.5s ease;
      z-index: 1;
    }

    .dashboard-card .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 2;
    }

    .dashboard-card h2 {
      position: relative;
      color: white;
      font-size: 2.5rem;
      text-transform: uppercase;
      letter-spacing: 4px;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
      z-index: 3;
      text-align: center;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .dashboard-card:hover h2 {
      font-size: 3rem;
      text-shadow: 4px 4px 12px rgba(0, 0, 0, 1);
    }
  `]
})
export class DashboardEntrenadorComponent {}