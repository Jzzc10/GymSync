import { Component } from '@angular/core';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioFormComponent  } from './usuario-form/usuario-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent {
  usuarios: Usuario[] = [];
  columnas = ['nombre', 'email', 'rol', 'acciones'];

  constructor(
    protected usuarioService: UsuarioService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar
  ) {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: (error) => this.mostrarError('Error al cargar usuarios: ' + error)
    });
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

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.cargarUsuarios();
        },
        error: (error) => this.mostrarError('Error al eliminar: ' + error)
      });
    }
  }

  getNombreRol(rol: string): string {
    return this.usuarioService.getNombreRol(rol);
  }

  protected mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
  }
}