import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContextService} from '../../service/context/context.service';
import {MatchContext, RootContext} from '../../service/context/context.dto';
import {NewRootContextModalComponent} from './new-root-context-modal/new-root-context-modal.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RootContextChoiceModalComponent} from './root-context-choice-modal/root-context-choice-modal.component';
import {Subscription} from 'rxjs';
import {NewContextModalComponent} from './new-context-modal/new-context-modal.component';

@Component({
  selector: 'app-admin-context',
  templateUrl: './admin-context.component.html'
})
export class AdminContextComponent implements OnInit, OnDestroy {

  context: RootContext;
  selectedContext: MatchContext;

  private subscription: Subscription;

  constructor(private service: ContextService, private dialog: MatDialog, private snack: MatSnackBar) {
  }

  ngOnInit() {
    this.subscription = this.service.getSelectedContext().subscribe(context => {
      if (!this.context || this.context.id !== context.id) {
        this.selectedContext = null;
      }
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

  deleteSelected() {
    if (this.selectedContext.children.length > 0) {
      this.snack.open('Remove children first!', 'failed', {
        duration: 3000
      });
    } else {
      this.service.removeContext(this.selectedContext.id).then(() => {
        this.selectedContext = undefined;
      });
    }
  }

  addNewGroup() {
    this.dialog.open(NewContextModalComponent, {
      width: '500px',
      data: {
        root: this.context.id,
        parent: this.selectedContext.id
      }
    });
  }

  addNewMatch() {
  }

  onSelectNode(context: MatchContext) {
    this.selectedContext = context;
  }
}
