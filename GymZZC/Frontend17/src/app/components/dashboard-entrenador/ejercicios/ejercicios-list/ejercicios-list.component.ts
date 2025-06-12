import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ejercicio, TipoEjercicioEnum } from '../../../../models/ejercicio.model';
import { EjercicioService } from '../../../../services/ejercicio.service';

declare var bootstrap: any; // Para usar Bootstrap JS

@Component({
  selector: 'app-ejercicio-list',
  templateUrl: './ejercicios-list.component.html',
  styleUrls: ['./ejercicios-list.component.css']
})
export class EjercicioListComponent implements OnInit {
  ejercicios: Ejercicio[] = [];
  ejerciciosFiltrados: Ejercicio[] = [];
  ejerciciosPaginados: Ejercicio[] = [];
  displayedColumns: string[] = ['nombre', 'tipo', 'acciones'];
  isLoading = true;
  searchTerm = '';
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;

  // Variables para el modal de eliminación
  ejercicioAEliminar: Ejercicio | null = null;
  isDeleting = false;
  private deleteModal: any;

  constructor(
    private ejercicioService: EjercicioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEjercicios();
    // Inicializar el modal de Bootstrap
    this.initializeModal();
  }

  private initializeModal(): void {
    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
      const modalElement = document.getElementById('deleteModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }, 100);
  }

  cargarEjercicios(): void {
    this.isLoading = true;
    this.ejercicioService.getEjercicios().subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
        this.ejerciciosFiltrados = ejercicios;
        this.actualizarPaginacion();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar ejercicios', error);
        this.isLoading = false;
      }
    });
  }

  buscarEjercicios(): void {
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      this.ejerciciosFiltrados = this.ejercicios.filter(ejercicio => 
        ejercicio.nombre.toLowerCase().includes(termino) ||
        this.getTipoDisplayName(ejercicio.tipo).toLowerCase().includes(termino)
      );
    } else {
      this.ejerciciosFiltrados = [...this.ejercicios];
    }
    this.currentPage = 1; // Resetear a primera página
    this.actualizarPaginacion();
  }

  // Método para búsqueda en tiempo real
  onSearchChange(): void {
    this.buscarEjercicios();
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.ejerciciosFiltrados = [...this.ejercicios];
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  editarEjercicio(id: number): void {
    this.router.navigate(['/entrenador/ejercicios/editar', id]);
  }

  // Nuevo método para mostrar el modal
  mostrarModalEliminar(ejercicio: Ejercicio): void {
    this.ejercicioAEliminar = ejercicio;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      // Fallback si el modal no se inicializó correctamente
      this.initializeModal();
      setTimeout(() => {
        if (this.deleteModal) {
          this.deleteModal.show();
        }
      }, 200);
    }
  }

  // Método para confirmar la eliminación
  confirmarEliminacion(): void {
    if (!this.ejercicioAEliminar || !this.ejercicioAEliminar.id) {
      return;
    }

    this.isDeleting = true;
    
    this.ejercicioService.deleteEjercicio(this.ejercicioAEliminar.id).subscribe({
      next: () => {
        // Cerrar el modal
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        
        // Mostrar toast de éxito
        this.mostrarToastExito();
        
        // Recargar la lista
        this.cargarEjercicios();
        
        // Reset variables
        this.ejercicioAEliminar = null;
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error al eliminar ejercicio', error);
        
        // Cerrar modal y mostrar error
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        
        // Aquí podrías mostrar un toast de error en lugar de alert
        alert('Error al eliminar el ejercicio. Por favor, inténtalo de nuevo.');
        
        this.ejercicioAEliminar = null;
        this.isDeleting = false;
      }
    });
  }

  // Método para mostrar el toast de éxito
  private mostrarToastExito(): void {
    setTimeout(() => {
      const toastElement = document.getElementById('deleteSuccessToast');
      if (toastElement && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }, 300); // Pequeño delay para que se vea bien la transición
  }

  nuevoEjercicio(): void {
    this.router.navigate(['/entrenador/ejercicios/nuevo']);
  }

  getTipoDisplayName(tipo: string): string {
    return this.ejercicioService.getTipoDisplayName(tipo as TipoEjercicioEnum);
  }

  // Método para obtener el icono según el tipo de ejercicio
  getIconoEjercicio(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'PECHO': 'bi bi-heart-fill', // Cambiado a iconos de Bootstrap
      'ESPALDA': 'bi bi-person-fill',
      'HOMBROS': 'bi bi-arrow-up-circle-fill',
      'BICEPS': 'bi bi-hand-thumbs-up-fill',
      'TRICEPS': 'bi bi-hand-index-fill',
      'PIERNAS': 'bi bi-legs',
      'GLUTEOS': 'bi bi-triangle-fill',
      'CORE': 'bi bi-bullseye',
      'CARDIO': 'bi bi-heart-pulse-fill',
      'FUNCIONAL': 'bi bi-gear-fill',
      'FLEXIBILIDAD': 'bi bi-flower1',
      'FULL_BODY': 'bi bi-person-circle'
    };

    return iconos[tipo] || 'bi bi-lightning-fill'; // Rayo por defecto
  }

  // Método para optimizar el rendimiento del *ngFor
  trackByEjercicio(index: number, ejercicio: Ejercicio): number {
    return ejercicio.id || index;
  }

  // Métodos de paginación
  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.ejerciciosFiltrados.length / this.itemsPerPage);
    this.actualizarEjerciciosPaginados();
  }

  actualizarEjerciciosPaginados(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.ejerciciosPaginados = this.ejerciciosFiltrados.slice(startIndex, endIndex);
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.actualizarEjerciciosPaginados();
    }
  }

  paginaAnterior(): void {
    this.cambiarPagina(this.currentPage - 1);
  }

  paginaSiguiente(): void {
    this.cambiarPagina(this.currentPage + 1);
  }

  getPaginasVisibles(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5; // Máximo 5 páginas visibles
    
    let inicio = Math.max(1, this.currentPage - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPages, inicio + maxPaginas - 1);
    
    // Ajustar el inicio si estamos cerca del final
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }
}