// app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        // Hide header en login
        this.showHeader = !event.url.includes('/login');
      }
      
      // if (!authService.isLoggedIn()) {
      //   localStorage.removeItem('authToken');
      //   localStorage.removeItem('userRole');
      //   localStorage.removeItem('currentUser');
      // }
    });
  }
}