import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './service/auth/auth.service';
import {NamePickerComponent} from './pages/login/name-picker/name-picker.component';
import {MatDialog} from '@angular/material';
import {User} from './service/auth/user.dto';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isAdmin: boolean;
  user: User;

  private userSubscription: Subscription;
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.userSubscription = this.authService.getUserChangeObservable().subscribe(user => {
      this.user = user;
      this.isAdmin = user && user.roles.findIndex((role) => role === 'ADMIN') >= 0;
    });
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login').then(() => {
      });
    });
  }

  changeNameDialog(): void {
    this.dialog.open(NamePickerComponent, {
      width: '500px'
    });
  }
}
