import { Component, OnInit } from '@angular/core';
import { RutinaService, Rutina } from '../../../services/rutina.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.component.html',
  styleUrls: ['./rutinas.component.css']
})
export class RutinasComponent implements OnInit {
  rutinas: Rutina[] = [];
  rutinasFiltradas: Rutina[] = [];
  cargando = true;
  searchTerm = '';

  constructor(
    private rutinaService: RutinaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    const entrenadorId = this.authService.getCurrentUserId();
    
    if (entrenadorId) {
      this.rutinaService.getRutinasByEntrenador(entrenadorId).subscribe({
        next: rutinas => {
          this.rutinas = rutinas;
          this.rutinasFiltradas = [...rutinas];
          this.cargando = false;
        },
        error: err => {
          console.error('Error cargando rutinas', err);
          this.cargando = false;
        }
      });
    }
  }

  buscarRutinas(): void {
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      this.rutinasFiltradas = this.rutinas.filter(rutina => 
        (rutina.clienteNombre && rutina.clienteNombre.toLowerCase().includes(termino)) ||
        (rutina.descripcion && rutina.descripcion.toLowerCase().includes(termino))
      );
    } else {
      this.rutinasFiltradas = [...this.rutinas];
    }
  }

  // Metodo para búsqueda en tiempo real
  onSearchChange(): void {
    this.buscarRutinas();
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.rutinasFiltradas = [...this.rutinas];
  }

  crearRutina(): void {
    this.router.navigate(['/entrenador/rutinas/crear']);
  }

  editarRutina(id: number): void {
    this.router.navigate(['/entrenador/rutinas/editar', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/entrenador/rutinas', id]);
  }

  toggleActiva(rutina: Rutina): void {
    rutina.activa = !rutina.activa;
    this.rutinaService.updateRutina(rutina.id!, rutina).subscribe({
      next: () => {
        // Actualizar la rutina localmente sin recargar todo
        const index = this.rutinas.findIndex(r => r.id === rutina.id);
        if (index !== -1) {
          this.rutinas[index] = { ...rutina };
        }
      },
      error: err => console.error('Error actualizando rutina', err)
    });
  }

  truncate(text: string | undefined, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Added the missing trackByRutina method
  trackByRutina(index: number, rutina: Rutina): number {
    return rutina.id || index;
  }
}