import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MatchContext} from '../../../service/context/context.dto';
import {Subscription} from 'rxjs';
import {SpinnerService} from '../../../components/spinner/spinner.service';
import {MatchService} from '../../../service/matches/match.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Match, Team} from '../../../service/matches/match.dto';
import {EditMatchComponent} from '../edit-match/edit-match.component';
import {EditBetComponent} from '../../bet-context/edit-bet/edit-bet.component';
import {TeamService} from '../../../service/team/team-service';

@Component({
  selector: 'app-match-table',
  templateUrl: './match-table.component.html'
})
export class MatchTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  matchContext: MatchContext;

  displayedColumns = [];
  dataSource: MatTableDataSource<Match>;

  private matchSubscription: Subscription;

  constructor(protected matchService: MatchService, protected dialog: MatDialog, protected spinner: SpinnerService) {
    this.dataSource = new MatTableDataSource<Match>([]);
  }

  ngOnInit() {
    this.displayedColumns = ['home', 'away', 'date', 'result', 'adminOps'];
  }

  ngOnChanges() {
    if (this.matchContext) {
      if (!this.matchContext.finished || !this.matchContext.matches) {
        this.reloadMatches();
      } else {
        this.dataSource.data = this.matchContext.matches;
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  reloadMatches() {
    this.spinner.show();
    this.unsubscribe();
    this.dataSource.data = [];
    this.matchSubscription = this.matchService.getItems(this.matchContext.rootId, this.matchContext.id).subscribe(matches => {
      if (matches) {
        this.onMatchesLoaded(matches);
        if (this.matchContext.finished) {
          this.unsubscribe();
        }
      }
    });
  }

  editMatch(match: Match, resultMode: boolean) {
    this.dialog.open(EditMatchComponent, {
      width: '500px',
      data: {
        match: match,
        resultMode: resultMode
      }
    });
  }

  deleteMatch(match: Match) {
    this.matchService.delete(match.id).then();
  }

  protected onMatchesLoaded(matches: Array<Match>) {
    this.matchContext.matches = matches;
    this.dataSource.data = matches;
    this.spinner.hide();
  }

  private unsubscribe() {
    if (this.matchSubscription) {
      this.matchSubscription.unsubscribe();
      delete this.matchSubscription;
    }
  }
}
