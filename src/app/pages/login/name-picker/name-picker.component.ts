import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';
import {MatDialogRef} from '@angular/material';
import {NewTeamComponent} from '../../team/new-team/new-team.component';
import {AuthService} from '../../../service/auth/auth.service';
import {User} from '../../../service/auth/user.dto';

@Component({
  selector: 'app-name-picker',
  templateUrl: './name-picker.component.html'
})
export class NamePickerComponent implements OnInit {
  nameControl = new FormControl('', [Validators.required]);
  matcher = new ZhBetErrorStateMatcher();
  user: User;

  constructor(private dialogRef: MatDialogRef<NewTeamComponent>, private service: AuthService) {
    this.user = service.user;
    this.nameControl.setValue(this.user.name);
  }

  ngOnInit() {
  }

  createNew() {
    if (this.nameControl.valid) {
      this.service.addUserWithName(this.nameControl.value).then(() => {
        this.dialogRef.close();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

}
