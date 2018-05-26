import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MatchContext} from '../../../service/context/context.dto';
import {Subscription} from 'rxjs';
import {SpinnerService} from '../../../components/spinner/spinner.service';
import {MatchService} from '../../../service/matches/match.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Match} from '../../../service/matches/match.dto';
import {EditMatchComponent} from '../edit-match/edit-match.component';

@Component({
  selector: 'app-match-table',
  templateUrl: './match-table.component.html'
})
export class MatchTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  matchContext: MatchContext;

  displayedColumns = ['home', 'away', 'date', 'result', 'ops'];
  dataSource: MatTableDataSource<Match>;

  private matchSubscription: Subscription;

  constructor(private matchService: MatchService, private dialog: MatDialog, private spinner: SpinnerService) {
    this.dataSource = new MatTableDataSource<Match>([]);
  }

  ngOnInit() {
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
      this.matchContext.matches = matches;
      this.dataSource.data = matches;
      if (this.matchContext.finished) {
        this.unsubscribe();
      }
      this.spinner.hide();
    });
  }

  editMatch(match: Match) {
    this.dialog.open(EditMatchComponent, {
      width: '500px',
      data: { match: match }
    });
  }

  deleteMatch(match: Match) {
    this.matchService.delete(match.id).then();
  }

  private unsubscribe() {
    if (this.matchSubscription) {
      this.matchSubscription.unsubscribe();
      delete this.matchSubscription;
    }
  }
}
