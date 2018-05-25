import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ContextService} from '../../../service/context/context.service';
import {MatchService} from '../../../service/matches/match.service';
import {Match, MatchResult} from '../../../service/matches/match.dto';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html'
})
export class EditMatchComponent implements OnInit {
  homeControl = new FormControl('', [Validators.required]);
  awayControl = new FormControl('', [Validators.required]);
  dateControl = new FormControl(new Date(), [Validators.required]);
  timeControl = new FormControl('', [Validators.required]);
  resultControl = new FormControl('');
  matcher = new ZhBetErrorStateMatcher();
  minDate = new Date();

  private id: string;
  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any,
              private contextService: ContextService, private matchService: MatchService) {
    if (data && data.match) {
      this.id = data.match.id;
      // init controls
    }
  }

  ngOnInit() {
  }

  createNew() {
    const match = new Match(this.id, this.homeControl.value, this.awayControl.value, this.dateControl.value, new MatchResult(1, 2));
    if (this.id) {
      this.matchService.update(this.id, match).then();
    } else {
      this.matchService.add(match).then();
    }
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
