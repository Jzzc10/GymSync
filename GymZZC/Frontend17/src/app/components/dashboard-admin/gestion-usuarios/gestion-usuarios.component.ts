// gestion-usuarios.component.ts
import { Component } from '@angular/core';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioFormComponent  } from './usuario-form/usuario-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var bootstrap: any; // Para usar Bootstrap JS

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosPaginados: Usuario[] = [];
  columnas = ['nombre', 'email', 'rol', 'acciones'];
  isLoading = true;
  searchTerm = '';
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;

  // Variables para el modal de eliminacion
  usuarioAEliminar: Usuario | null = null;
  isDeleting = false;
  private deleteModal: any;

  constructor(
    protected usuarioService: UsuarioService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar
  ) {
    this.cargarUsuarios();
    // Inicializar el modal de Bootstrap
    setTimeout(() => this.initializeModal(), 100);
  }

  private initializeModal(): void {
    const modalElement = document.getElementById('deleteModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
  }

  // Método que puede ser sobrescrito por las clases hijas
  protected getRolFiltro(): string | null {
    return 'CLIENTE'; // Por defecto filtra solo clientes
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        const rolFiltro = this.getRolFiltro();
        
        // Aplicar filtro de rol solo si se especifica
        if (rolFiltro) {
          this.usuarios = usuarios.filter(usuario => usuario.rol === rolFiltro);
        } else {
          this.usuarios = usuarios;
        }
        
        this.usuariosFiltrados = [...this.usuarios];
        this.actualizarPaginacion();
        this.isLoading = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar usuarios: ' + error);
        this.isLoading = false;
      }
    });
  }

  buscarUsuarios(): void {
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      this.usuariosFiltrados = this.usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino)
      );
    } else {
      this.usuariosFiltrados = [...this.usuarios];
    }
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  onSearchChange(): void {
    this.buscarUsuarios();
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.usuariosFiltrados = [...this.usuarios];
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  abrirFormulario(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioFormComponent , {
      width: '500px',
      data: { usuario }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarUsuarios();
    });
  }

  mostrarModalEliminar(usuario: Usuario): void {
    this.usuarioAEliminar = usuario;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      this.initializeModal();
      setTimeout(() => {
        if (this.deleteModal) {
          this.deleteModal.show();
        }
      }, 200);
    }
  }

  confirmarEliminacion(): void {
    if (!this.usuarioAEliminar || !this.usuarioAEliminar.id) {
      return;
    }

    this.isDeleting = true;
    
    this.usuarioService.deleteUsuario(this.usuarioAEliminar.id).subscribe({
      next: () => {
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        
        this.mostrarToastExito();
        this.cargarUsuarios();
        
        this.usuarioAEliminar = null;
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error al eliminar usuario', error);
        
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        
        this.mostrarError('Error al eliminar: ' + error);
        
        this.usuarioAEliminar = null;
        this.isDeleting = false;
      }
    });
  }

  private mostrarToastExito(): void {
    setTimeout(() => {
      const toastElement = document.getElementById('deleteSuccessToast');
      if (toastElement && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }, 300);
  }

  eliminarUsuario(id: number): void {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
      this.mostrarModalEliminar(usuario);
    }
  }

  getNombreRol(rol: string): string {
    return this.usuarioService.getNombreRol(rol);
  }

  protected mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
  }

  // Método para optimizar el rendimiento del *ngFor
  trackByUsuario(index: number, usuario: Usuario): number {
    return usuario.id || index;
  }

  // Métodos de paginación
  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
    this.actualizarUsuariosPaginados();
  }

  actualizarUsuariosPaginados(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.usuariosPaginados = this.usuariosFiltrados.slice(startIndex, endIndex);
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.actualizarUsuariosPaginados();
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
    const maxPaginas = 5;
    
    let inicio = Math.max(1, this.currentPage - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPages, inicio + maxPaginas - 1);
    
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }
}