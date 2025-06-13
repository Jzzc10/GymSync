// gestion-entrenadores.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { GestionUsuariosComponent } from '../gestion-usuarios/gestion-usuarios.component';

@Component({
  selector: 'app-gestion-entrenadores',
  templateUrl: './gestion-entrenadores.component.html',
  styleUrls: ['./gestion-entrenadores.component.css']
})
export class GestionEntrenadoresComponent extends GestionUsuariosComponent implements OnInit {
  
  constructor(
    usuarioService: UsuarioService,
    dialog: MatDialog,
    snackBar: MatSnackBar
  ) {
    super(usuarioService, dialog, snackBar);
  }

  ngOnInit(): void {
    console.log('🚀 Inicializando GestionEntrenadoresComponent');
    this.cargarUsuarios();
  }

  // Sobrescribir el método para filtrar solo entrenadores
  protected override getRolFiltro(): string | null {
    return 'ENTRENADOR';
  }

  override cargarUsuarios(): void {
    console.log('📥 Cargando entrenadores...');
    this.isLoading = true;
    
    // Usar el método específico del servicio para entrenadores
    this.usuarioService.getEntrenadores().subscribe({
      next: (entrenadores) => {
        console.log('✅ Entrenadores cargados:', entrenadores);
        this.usuarios = entrenadores;
        this.usuariosFiltrados = [...entrenadores];
        this.actualizarPaginacion();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar entrenadores:', error);
        this.isLoading = false;
        this.usuarios = [];
        this.usuariosFiltrados = [];
        
        // Usar método padre para mostrar error
        if (this.snackBar) {
          this.snackBar.open('Error al cargar entrenadores: ' + (error.message || error), 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }
    });
  }
}