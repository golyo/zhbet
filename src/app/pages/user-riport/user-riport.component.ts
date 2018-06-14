import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../service/auth/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../service/auth/user.dto';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {SpinnerService} from '../../components/spinner/spinner.service';

@Component({
  selector: 'app-user-riport',
  templateUrl: './user-riport.component.html',
  styleUrls: ['./user-riport.component.css']
})
export class UserRiportComponent implements OnInit, OnDestroy {
  displayedColumns = ['pos', 'name', 'email', 'context', 'point', 'teamPoint', 'betPoint', 'ops'];
  users: Array<User>;
  dataSource: MatTableDataSource<User>;
  myContext: string;
  filtered = false;

  private userSubscription: Subscription;

  constructor(private authService: AuthService, private spinner: SpinnerService, private snack: MatSnackBar) {
    this.myContext = this.authService.user.context;
  }

  ngOnInit() {
    if (!this.authService.user.isAdmin()) {
      this.displayedColumns.splice(2,1);
    }
    this.spinner.show();
    this.userSubscription = this.authService.getUsers(true).subscribe(users => {
      this.users = users;
      this.dataSource = new MatTableDataSource<User>(users);
      this.spinner.hide();
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleFilter() {
    if (this.filtered) {
      this.dataSource = new MatTableDataSource<User>(this.users);
    } else {
      this.dataSource = new MatTableDataSource<User>(this.users.filter(user => user.context === this.myContext));
    }
    this.filtered = !this.filtered;
  }

  showDetails(user: User) {
    this.snack.open('Under construction', undefined, { duration: 3000 });
  }

  setPaid(user: User) {
    this.authService.setPaid(user).then(() => {
      this.snack.open('User set paid ' + user, undefined, { duration: 3000 });
    });
  }
}
