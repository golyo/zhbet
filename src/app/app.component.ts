import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './service/auth/auth.service';
import {NamePickerComponent} from './pages/login/name-picker/name-picker.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {
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

  changeNameDialog(): void {
    this.dialog.open(NamePickerComponent, {
      width: '500px'
    });
  }
}
