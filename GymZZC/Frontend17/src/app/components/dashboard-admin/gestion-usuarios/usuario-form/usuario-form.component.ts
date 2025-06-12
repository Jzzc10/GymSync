import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService, Usuario } from '../../../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  
  roles = [
    { value: 'ADMIN', viewValue: 'Administrador' },
    { value: 'ENTRENADOR', viewValue: 'Entrenador' },
    { value: 'CLIENTE', viewValue: 'Cliente' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario?: Usuario }
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    if (data?.usuario) {
      this.isEditMode = true;
      this.form.patchValue(data.usuario);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {}

  guardar(): void {
    if (this.form.valid) {
      const usuario: Usuario = this.form.value;
      
      if (this.isEditMode) {
        const userId = this.data.usuario!.id!;
        this.usuarioService.updateUsuario(userId, usuario).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error al actualizar: ' + error, 'Cerrar', { duration: 5000 });
          }
        });
      } else {
        this.usuarioService.createUsuario(usuario).subscribe({
          next: () => {
            this.snackBar.open('Usuario creado', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error al crear: ' + error, 'Cerrar', { duration: 5000 });
          }
        });
      }
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}