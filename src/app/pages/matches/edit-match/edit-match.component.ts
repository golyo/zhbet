import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ContextService} from '../../../service/context/context.service';
import {MatchService} from '../../../service/matches/match.service';
import {Match, MatchResult} from '../../../service/matches/match.dto';

const TIME_DELIM = ':';
const RESULT_DELIM = '-';

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
    const match = (data ? data.match : undefined) as Match;
    if (match) {
      this.id = data.match.id;
      this.homeControl.setValue(match.home);
      this.awayControl.setValue(match.away);
      this.dateControl.setValue(match.start);
      this.timeControl.setValue(match.start.getHours() + TIME_DELIM + match.start.getMinutes());
      if (match.result) {
        this.resultControl.setValue(match.result.home + RESULT_DELIM + match.result.away);
      }
    }
    console.log('EDIT MATCH', match);
  }

  ngOnInit() {
  }

  createNew() {
    const date = this.dateControl.value as Date;
    const times = this.timeControl.value.split(TIME_DELIM);
    console.log('DATE', date, this.dateControl.value, times, this.timeControl.value);
    date.setHours(times[0], times[1]);
    console.log('TRANSFORMED DATE', date);
    const results = this.resultControl.value.split(RESULT_DELIM);
    const result = results.length === 2 ? new MatchResult(results[0], results[1]) : undefined;
    const match = new Match(this.id, this.homeControl.value, this.awayControl.value, date, result);
    console.log('SAVE MATCH', match);
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
