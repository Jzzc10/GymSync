import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      loggedIn => this.isLoggedIn = loggedIn
    );
  }

  // Método unificado para login/logout
  onAuthClick(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
    } else {
      this.authService.login();
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  onStatisticsClick(): void {
    console.log('Estadísticas clicked');
  }

  onTrainerClick(): void {
    console.log('Entrenador clicked');
  }

  onClockClick(): void {
    console.log('Reloj clicked');
  }

  onCalendarClick(): void {
    console.log('Calendario clicked');
  }
}