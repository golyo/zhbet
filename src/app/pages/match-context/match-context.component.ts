import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ContextService} from '../../service/context/context.service';
import {RootContextChoiceModalComponent} from '../admin-context/root-context-choice-modal/root-context-choice-modal.component';
import {RootContext} from '../../service/context/context.dto';
import {NewRootContextModalComponent} from '../admin-context/new-root-context-modal/new-root-context-modal.component';
import {Subscription} from 'rxjs';

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
