import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-temporizador',
  templateUrl: './temporizador.component.html',
  styleUrls: ['./temporizador.component.css']
})
export class TemporizadorComponent implements OnInit, OnDestroy {
  // Configuración del temporizador
  minutos: number = 1;
  segundos: number = 0;
  repeticiones: number = 1;
  
  // Estado del temporizador
  tiempoRestante: number = 0;
  repeticionesRestantes: number = 0;
  estaActivo: boolean = false;
  estaPausado: boolean = false;
  intervalo: any;
  
  // Formato de tiempo
  tiempoFormateado: string = '01:00';

  ngOnInit(): void {
    this.actualizarTiempoFormateado();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }

  iniciarTemporizador(): void {
    if (this.minutos === 0 && this.segundos === 0) {
      Swal.fire('Error', 'El tiempo debe ser mayor a 0', 'error');
      return;
    }
    
    if (this.repeticiones <= 0) {
      Swal.fire('Error', 'Las repeticiones deben ser al menos 1', 'error');
      return;
    }
    
    // Convertir el tiempo a segundos
    this.tiempoRestante = this.minutos * 60 + this.segundos;
    this.repeticionesRestantes = this.repeticiones;
    this.estaActivo = true;
    this.estaPausado = false;
    
    this.ejecutarCiclo();
  }

  ejecutarCiclo(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
        this.actualizarTiempoFormateado();
      } else {
        clearInterval(this.intervalo);
        this.repeticionesRestantes--;
        
        if (this.repeticionesRestantes > 0) {
          Swal.fire({
            title: '¡Tiempo completado!',
            text: `Quedan ${this.repeticionesRestantes} repeticiones. ¿Continuar?`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'No, detener'
          }).then((result) => {
            if (result.isConfirmed) {
              // Reiniciar el tiempo para la siguiente repetición
              this.tiempoRestante = this.minutos * 60 + this.segundos;
              this.actualizarTiempoFormateado();
              this.ejecutarCiclo();
            } else {
              this.resetearTemporizador();
            }
          });
        } else {
          Swal.fire('¡Completado!', 'Todas las repeticiones han sido completadas.', 'success');
          this.resetearTemporizador();
        }
      }
    }, 1000);
  }

  pausarTemporizador(): void {
    if (this.estaActivo && !this.estaPausado) {
      clearInterval(this.intervalo);
      this.estaPausado = true;
    }
  }

  reanudarTemporizador(): void {
    if (this.estaActivo && this.estaPausado) {
      this.estaPausado = false;
      this.ejecutarCiclo();
    }
  }

  resetearTemporizador(): void {
    this.detenerTemporizador();
    this.tiempoRestante = this.minutos * 60 + this.segundos;
    this.actualizarTiempoFormateado();
    this.repeticionesRestantes = this.repeticiones;
  }

  detenerTemporizador(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
    this.estaActivo = false;
    this.estaPausado = false;
  }

  actualizarTiempoFormateado(): void {
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    this.tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }

  // Validación de inputs
  validarMinutos(): void {
    if (this.minutos < 0) this.minutos = 0;
    if (this.minutos > 59) this.minutos = 59;
    this.tiempoRestante = this.minutos * 60 + this.segundos;
    this.actualizarTiempoFormateado();
  }

  validarSegundos(): void {
    if (this.segundos < 0) this.segundos = 0;
    if (this.segundos > 59) this.segundos = 59;
    this.tiempoRestante = this.minutos * 60 + this.segundos;
    this.actualizarTiempoFormateado();
  }

  validarRepeticiones(): void {
    if (this.repeticiones < 1) this.repeticiones = 1;
    this.repeticionesRestantes = this.repeticiones;
  }
}