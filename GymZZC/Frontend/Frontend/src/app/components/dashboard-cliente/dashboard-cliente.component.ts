import { Component, OnInit } from '@angular/core';
import { RutinaService } from '../../services/rutina.service';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: false,
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent implements OnInit{
  nombre: string = 'Cliente';
  descripcion: string = 'Bienvenido a GymSync, tu aplicación de gestión de gimnasio. Aquí podrás administrar tus rutinas, entrenamientos y mucho más.';

  ngOnInit(): void {
    // Aquí puedes realizar cualquier inicialización necesaria al cargar el componente
    console.log('DashboardClienteComponent ha sido inicializado');
  }

  // rutinas: string[] = [];
  // constructor(private rutinasService: RutinaService){}
}
