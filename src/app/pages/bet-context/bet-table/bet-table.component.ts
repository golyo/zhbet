import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatchTableComponent} from '../../matches/match-table/match-table.component';
import {MatDialog} from '@angular/material';
import {SpinnerService} from '../../../components/spinner/spinner.service';
import {MatchService} from '../../../service/matches/match.service';
import {Match} from '../../../service/matches/match.dto';
import {Subscription} from 'rxjs';
import {MatchResultBet} from '../../../service/bets/bet.dto';
import {BetService} from '../../../service/bets/bet.service';
import {EditBetComponent} from '../edit-bet/edit-bet.component';

@Component({
  selector: 'app-bet-table',
  templateUrl: './bet-table.component.html',
  styleUrls: ['./bet-table.component.css']
})
export class BetTableComponent extends MatchTableComponent implements OnInit, OnDestroy {

  private betSubscription: Subscription;

  constructor(matchService: MatchService, dialog: MatDialog, spinner: SpinnerService, private betService: BetService) {
    super(matchService, dialog, spinner);
  }

  ngOnInit() {
    this.displayedColumns = ['home', 'away', 'date', 'result', 'myBet', 'betOps'];
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.betSubscription) {
      this.betSubscription.unsubscribe();
    }
  }

  editBet(match: Match) {
    this.dialog.open(EditBetComponent, {
      width: '500px',
      data: {
        bet: match
      }
    });
  }

  onMatchesLoaded(matches: Array<Match>) {
    if (this.betSubscription) {
      this.betSubscription.unsubscribe();
    }
    if (matches.length > 0 && !(matches[0] instanceof MatchResultBet)) {
      this.betSubscription = this.betService.getItems(this.matchContext.rootId, this.matchContext.id).subscribe(items => {
        if (items) {
          const matchBets: Array<MatchResultBet> = [];
          matches.forEach((match, idx) => {
            const betDto = items ? items.find((item) => item.matchId === match.id) : null;
            matchBets.push(new MatchResultBet(match, betDto));
          });
          console.log('BET READY', matches, matchBets);
          super.onMatchesLoaded(matchBets);
        }
      });
    }
  }
}
