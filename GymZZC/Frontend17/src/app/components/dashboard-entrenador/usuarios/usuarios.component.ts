// src/app/components/dashboard-entrenador/usuarios/usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { ProgresoService } from '../../../services/progreso.service';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  entrenadorId: number;
  loading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private progresoService: ProgresoService,
    private router: Router
  ) {
    this.entrenadorId = this.authService.getCurrentUser()?.id || 0;
  }

  ngOnInit(): void {
    this.cargarUsuariosAsignados();
  }

  cargarUsuariosAsignados(): void {
    this.loading = true;
    this.usuarioService.getClientesAsignados(this.entrenadorId).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargarProgresosUsuarios();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.loading = false;
      }
    });
  }

  cargarProgresosUsuarios(): void {
    this.usuarios.forEach(usuario => {
      this.progresoService.getResumenProgreso(usuario.id).subscribe({
        next: (progreso) => {
          usuario.progreso = progreso;
        },
        error: (err) => console.error('Error cargando progreso', err)
      });
    });
  }

  // Funciones para estadísticas
  getUsuariosActivos(): number {
    return this.usuarios.filter(usuario => {
      const ultimaSesion = usuario.progreso?.ultimaSesion;
      if (!ultimaSesion) return false;
      
      const fechaUltimaSesion = new Date(ultimaSesion);
      const hoy = new Date();
      const diffTime = Math.abs(hoy.getTime() - fechaUltimaSesion.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= 7; // Activos si entrenaron en los últimos 7 días
    }).length;
  }

  getPromedioProgreso(): number {
    if (this.usuarios.length === 0) return 0;
    
    const sumaProgreso = this.usuarios.reduce((suma, usuario) => {
      return suma + (usuario.progreso?.porcentajeCompletado || 0);
    }, 0);
    
    return Math.round(sumaProgreso / this.usuarios.length);
  }

  getUsuariosCompletados(): number {
    return this.usuarios.filter(usuario => 
      (usuario.progreso?.porcentajeCompletado || 0) >= 100
    ).length;
  }

  getEstadoEntrenoBadge(ultimaSesion: string | null): string {
    if (!ultimaSesion) return 'badge-sin-datos';
    
    const fechaUltimaSesion = new Date(ultimaSesion);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - fechaUltimaSesion.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return 'badge-activo';
    if (diffDays <= 7) return 'badge-moderado';
    return 'badge-inactivo';
  }

  getEstadoEntrenoTexto(ultimaSesion: string | null): string {
    if (!ultimaSesion) return 'Sin datos';
    
    const fechaUltimaSesion = new Date(ultimaSesion);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - fechaUltimaSesion.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Hoy';
    if (diffDays <= 3) return 'Activo';
    if (diffDays <= 7) return 'Esta semana';
    return 'Inactivo';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short' 
    };
    
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  // Funciones de navegación y acciones - TEMPORALMENTE CON ALERTS
  asignarUsuario(): void {
    // Por ahora mostramos un alert hasta crear el componente
    alert('Funcionalidad "Asignar Usuario" en desarrollo.\nComponente AsignarUsuarioComponent pendiente de crear.');
    
    // Cuando crees el componente, descomenta:
    // this.router.navigate(['/entrenador/asignar-usuario']);
  }

  verDetalleUsuario(usuarioId: number): void {
    // Por ahora mostramos un alert hasta crear el componente
    alert(`Funcionalidad "Ver Detalle Usuario" en desarrollo.\nUsuario ID: ${usuarioId}\nComponente UsuarioDetalleComponent pendiente de crear.`);
    
    // Cuando crees el componente, descomenta:
    // this.router.navigate(['/entrenador/usuario-detalle', usuarioId]);
  }

  asignarRutina(usuarioId: number): void {
    // Por ahora mostramos un alert hasta crear el componente
    alert(`Funcionalidad "Asignar Rutina" en desarrollo.\nUsuario ID: ${usuarioId}\nComponente AsignarRutinaComponent pendiente de crear.`);
    
    // Cuando crees el componente, descomenta:
    // this.router.navigate(['/entrenador/asignar-rutina', usuarioId]);
  }

  verProgreso(usuarioId: number): void {
    // Por ahora mostramos un alert hasta crear el componente
    alert(`Funcionalidad "Ver Progreso" en desarrollo.\nUsuario ID: ${usuarioId}\nComponente ProgresoUsuarioComponent pendiente de crear.`);
    
    // Cuando crees el componente, descomenta:
    // this.router.navigate(['/entrenador/progreso-usuario', usuarioId]);
  }

  // TrackBy function para optimizar la renderización
  trackByUsuario(index: number, usuario: any): any {
    return usuario.id;
  }

  // Función para mostrar toast de confirmación
  mostrarToast(mensaje: string): void {
    const toastElement = document.getElementById('actionSuccessToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toastElement && toastMessage) {
      toastMessage.textContent = mensaje;
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}