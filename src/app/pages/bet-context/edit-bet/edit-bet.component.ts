import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatchResult} from '../../../service/matches/match.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatchService} from '../../../service/matches/match.service';
import {ZhBetErrorStateMatcher} from '../../../util/error-state-matcher';
import {FormControl} from '@angular/forms';
import {SpinnerService} from '../../../components/spinner/spinner.service';
import {ContextService} from '../../../service/context/context.service';
import {BetDto, MatchResultBet} from '../../../service/bets/bet.dto';
import {resultValidator} from '../../matches/edit-match/edit-match.component';
import {BetService} from '../../../service/bets/bet.service';

@Component({
  selector: 'app-edit-bet',
  templateUrl: './edit-bet.component.html',
  styleUrls: ['./edit-bet.component.css']
})
export class EditBetComponent implements OnInit, OnDestroy {
  bet: MatchResultBet;
  resultControl = new FormControl('', [resultValidator()]);
  matcher = new ZhBetErrorStateMatcher();

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private spinner: SpinnerService,
              private contextService: ContextService, private matchService: MatchService, private betService: BetService) {
    this.bet = this.data.bet;
    if (this.bet.bet) {
      this.resultControl.setValue(this.bet.bet.toString());
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  saveBet() {
    if (this.resultControl.valid) {
      this.spinner.show();
      this.bet.bet = MatchResult.fromString(this.resultControl.value);
      const betStr = this.bet.bet ? this.bet.bet.toString() : null;
      const betDto = new BetDto(this.bet.betId, this.bet.user, this.bet.id, betStr, this.bet.point);
      if (this.bet.betId) {
        this.betService.update(this.bet.betId, betDto).then( () => {
          this.spinner.hide();
          this.close();
        });
      } else {
        this.betService.add(betDto).then( () => {
          this.spinner.hide();
          this.close();
        });
      }
    }
  }


  close() {
    this.dialogRef.close();
  }
}
