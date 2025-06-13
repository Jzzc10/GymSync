import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutinaService, Rutina } from '../../../../services/rutina.service';

@Component({
  selector: 'app-rutina-detalle',
  templateUrl: './rutina-detalle.component.html',
  styleUrl: './rutina-detalle.component.css',
})
export class RutinaDetalleComponent implements OnInit {
  rutina?: Rutina;

  constructor(
    private route: ActivatedRoute,
    private rutinaService: RutinaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarRutina(id);
  }

  cargarRutina(id: number): void {
    this.rutinaService.getRutinaById(id).subscribe({
      next: (rutina) => {
        this.rutina = rutina;
        console.log('Rutina cargada:', rutina);
      },
      error: (error) => {
        console.error('Error cargando rutina:', error);
      }
    });
  }
}