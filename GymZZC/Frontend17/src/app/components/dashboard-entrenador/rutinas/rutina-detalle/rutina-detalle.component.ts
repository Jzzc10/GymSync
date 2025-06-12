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
    this.rutinaService.getRutinaById(id).subscribe(
      rutina => this.rutina = rutina,
      error => console.error('Error cargando rutina', error)
    );
  }

  toggleActiva(): void {
    if (this.rutina) {
      this.rutina.activa = !this.rutina.activa;
      this.rutinaService.updateRutina(this.rutina.id!, this.rutina).subscribe(
        () => console.log('Estado actualizado'),
        error => console.error('Error actualizando estado', error)
      );
    }
  }
}