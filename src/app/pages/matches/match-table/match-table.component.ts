import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {MatchContext} from '../../../service/context/context.dto';
import {Subscription} from 'rxjs';
import {SpinnerService} from '../../../components/spinner/spinner.service';
import {MatchService} from '../../../service/matches/match.service';
import {MatTableDataSource} from '@angular/material';
import {Match, MatchResult} from '../../../service/matches/match.dto';

@Component({
  selector: 'app-match-table',
  templateUrl: './match-table.component.html'
})
export class MatchTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  matchContext: MatchContext;

  displayedColumns = ['home', 'away', 'date', 'result'];
  dataSource: MatTableDataSource<Match>;

  private matchSubscription: Subscription;

  constructor(private matchService: MatchService, private spinner: SpinnerService) {
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

  private unsubscribe() {
    if (this.matchSubscription) {
      this.matchSubscription.unsubscribe();
      delete this.matchSubscription;
    }
  }
}
