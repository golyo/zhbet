import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ADMIN_ROLE, AuthService} from '../../service/auth/auth.service';
import {MatDialog} from '@angular/material';
import {NamePickerComponent} from './name-picker/name-picker.component';
import {Subscriber, Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  userLoggedIn: boolean;
  showNameWarning: boolean;
  userChangedSubscription: Subscription;
  isModalOpen: boolean;

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog, private zone: NgZone) {
  }

  ngOnInit() {
    this.userChangedSubscription = this.authService.getUserChangeObservable().subscribe(isSuccess => {
      if (isSuccess) {
        this.userLoggedIn = true;
        if (!this.authService.user.id) {
          this.openNameDialog();
        } else {
          this.zone.run(() => this.router.navigateByUrl('/home').then()).then();
        }
      }
    });
  }

  ngOnDestroy() {
    this.userChangedSubscription.unsubscribe();
  }

  login() {
    this.authService.login();
  }

  openNameDialog(): void {
    if (this.isModalOpen) {
      return;
    }
    this.isModalOpen = true;
    const dialogRef = this.dialog.open(NamePickerComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isModalOpen = false;
      if (this.authService.user.id) {
        this.zone.run(() => this.router.navigateByUrl('/home').then()).then();
      } else {
        this.showNameWarning = true;
      }
    });
  }
}
