import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatchService} from '../../service/matches/match.service';
import {MatchContext, RootContext} from '../../service/context/context.dto';
import {Subscription} from 'rxjs';
import {ContextService} from '../../service/context/context.service';
import {BetService} from '../../service/bets/bet.service';

@Component({
  selector: 'app-bet-context',
  templateUrl: './bet-context.component.html',
  styleUrls: ['./bet-context.component.css']
})
export class BetContextComponent implements OnInit, OnDestroy {

  context: RootContext;
  selectedContext: MatchContext;

  private contextSubscription: Subscription;
  private betSubscription: Subscription;

  constructor(private contextService: ContextService, private matchService: MatchService, private betService: BetService) {
  }

  ngOnInit() {
    this.contextSubscription = this.contextService.getSelectedContext().subscribe(context => {
      if (!this.context || this.context.id !== context.id) {
        this.selectedContext = null;
      }
      this.context = context;
    });
  }

  ngOnDestroy() {
    this.contextSubscription.unsubscribe();
    if (this.betSubscription) {
      this.betSubscription.unsubscribe();
    }
  }

  onSelectNode(context: MatchContext) {
    this.selectedContext = context;
  }
}
