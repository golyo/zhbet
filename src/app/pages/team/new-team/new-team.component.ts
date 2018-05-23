import {Component, Inject, OnInit} from '@angular/core';
import {Team} from '../../../service/matches/match.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TeamService} from '../../../service/team/team-service';
import {FormControl, Validators} from '@angular/forms';
import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';


@Component({
  selector: 'app-new-team',
  templateUrl: './new-team.component.html',
  styleUrls: ['./new-team.component.css']
})
export class NewTeamComponent implements OnInit {
  team: Team;
  nameControl = new FormControl('', [Validators.required]);
  matcher = new ZhBetErrorStateMatcher();

  constructor(private dialogRef: MatDialogRef<NewTeamComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private service: TeamService) {
    this.team = data.team || new Team();
    this.nameControl.setValue(this.team.name);
  }

  ngOnInit() {
  }

  save() {
    if (this.nameControl.valid) {
      this.team.name = this.nameControl.value;
      this.service.updateItem(this.team).then(() => {
        this.dialogRef.close(this.team);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
