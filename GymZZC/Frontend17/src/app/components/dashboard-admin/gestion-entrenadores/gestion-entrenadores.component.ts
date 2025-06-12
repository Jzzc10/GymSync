import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { GestionUsuariosComponent } from '../gestion-usuarios/gestion-usuarios.component';

@Component({
  selector: 'app-gestion-entrenadores',
  templateUrl: './gestion-entrenadores.component.html',
  styleUrls: ['./gestion-entrenadores.component.css']
})
export class GestionEntrenadoresComponent extends GestionUsuariosComponent {
  
  constructor(
    usuarioService: UsuarioService,
    dialog: MatDialog,
    snackBar: MatSnackBar
  ) {
    super(usuarioService, dialog, snackBar);
  }

  override cargarUsuarios(): void {
    this.usuarioService.getEntrenadores().subscribe({
      next: (entrenadores) => this.usuarios = entrenadores,
      error: (error) => this.mostrarError('Error al cargar entrenadores: ' + error)
    });
  }
}