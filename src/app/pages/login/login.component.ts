import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ADMIN_ROLE, AuthService} from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router, protected zone: NgZone) {
  }

  login() {
    this.authService.getUserChangeObservable().subscribe(isSuccess => {
      if (isSuccess) {
        if (this.authService.user.roles.indexOf(ADMIN_ROLE) >= 0) {
          this.zone.run(() => this.router.navigateByUrl('/home').then()).then();
        } else {
          // TODO gallery
          this.zone.run(() => this.router.navigateByUrl('/home').then()).then();
        }
      }
    });
    this.authService.login();
  }
}
