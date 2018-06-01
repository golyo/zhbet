import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {ContextService} from '../../../service/context/context.service';
import {MatchService} from '../../../service/matches/match.service';
import {Match, MatchResult, RESULT_DELIM, Team} from '../../../service/matches/match.dto';
import {TeamService} from '../../../service/team/team-service';
import {Subscription} from 'rxjs';
import {SpinnerService} from '../../../components/spinner/spinner.service';

const TIME_DELIM = ':';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html'
})
export class EditMatchComponent implements OnInit, OnDestroy {
  id: string;
  homeControl = new FormControl('', [Validators.required]);
  awayControl = new FormControl('', [Validators.required]);
  dateControl = new FormControl(new Date(), [Validators.required]);
  timeControl = new FormControl('', [Validators.required]);
  resultControl = new FormControl('', [resultValidator()]);
  matcher = new ZhBetErrorStateMatcher();
  minDate = new Date();
  teams: Array<Team>;
  private teamSubscription: Subscription;

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private spinner: SpinnerService,
              private contextService: ContextService, private teamService: TeamService, private matchService: MatchService) {
    const match = (data ? data.match : undefined) as Match;
    if (match) {
      this.id = data.match.id;
      this.homeControl.setValue(match.home);
      this.awayControl.setValue(match.away);
      this.dateControl.setValue(match.start);
      this.timeControl.setValue(match.start.getHours() + TIME_DELIM + match.start.getMinutes());
      if (match.result) {
        this.resultControl.setValue(match.result.toString());
      }
      if (data.resultMode) {
        this.homeControl.disable();
        this.awayControl.disable();
        this.dateControl.disable();
        this.timeControl.disable();
      } else {
        this.resultControl.disable();
      }
    }
  }

  ngOnInit() {
    this.teamSubscription = this.teamService.getItems(this.contextService.selectedRoot).subscribe(teams => {
      this.teams = teams;
    });
  }

  ngOnDestroy() {
    this.teamSubscription.unsubscribe();
  }

  saveMatch() {
    const match = this.getMatch();
    if (!this.resultControl.disabled) {
      if (this.resultControl.valid) {
        match.result = MatchResult.fromString(this.resultControl.value);
        this.runPromise(this.matchService.updateResult(match));
      }
      console.log('XXX', match.result);
    } else if (this.homeControl.valid && this.awayControl.valid && this.dateControl.valid && this.timeControl.valid) {
      if (this.id) {
        this.runPromise(this.matchService.update(this.id, match));
      } else {
        this.runPromise(this.matchService.add(match));
      }
    }
  }

  private runPromise(promise: Promise<any>) {
    this.spinner.show();
    promise.then(() => {
      this.spinner.hide();
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }

  private getMatch(): Match {
    const date = this.dateControl.value as Date;
    const times = this.timeControl.value.split(TIME_DELIM);
    date.setHours(times[0], times[1]);
    return new Match(this.id, this.homeControl.value, this.awayControl.value, date);
  }
}

export function resultValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (control.value) {
      const results = control.value.split(RESULT_DELIM);
      if (results.length === 1) {
        return {'invalidResult': {value: control.value}};
      }
    }
    return null;
  };
}
