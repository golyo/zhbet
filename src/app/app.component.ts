import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './service/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login').then(() => {
      });
    });
  }

  get user() {
    return this.authService.user;
  }
}
