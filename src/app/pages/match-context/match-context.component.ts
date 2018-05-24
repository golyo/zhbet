import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ContextService} from '../../service/context/context.service';
import {Team} from '../../service/matches/match.dto';
import {NewTeamComponent} from '../team/new-team/new-team.component';
import {RootContextChoiceModalComponent} from '../admin-context/root-context-choice-modal/root-context-choice-modal.component';
import {MatchContext, RootContext} from '../../service/context/context.dto';
import {NewContextModalComponent} from '../admin-context/new-context-modal/new-context-modal.component';
import {NewRootContextModalComponent} from '../admin-context/new-root-context-modal/new-root-context-modal.component';
import {Subscription} from 'rxjs';
import {SpinnerService} from '../../components/spinner/spinner.service';

@Component({
  selector: 'app-match-context',
  templateUrl: './match-context.component.html',
  styleUrls: ['./match-context.component.css']
})
export class MatchContextComponent implements OnInit, OnDestroy {
  context: RootContext;
  private subscription: Subscription;

  constructor(private service: ContextService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subscription = this.service.getSelectedContext().subscribe(context => {
      this.context = context;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openChoiceDialog() {
    this.dialog.open(RootContextChoiceModalComponent, {
      width: '500px',
    });
  }

  openNewRootDialog() {
    this.dialog.open(NewRootContextModalComponent, {
      width: '500px',
    });
  }
}
