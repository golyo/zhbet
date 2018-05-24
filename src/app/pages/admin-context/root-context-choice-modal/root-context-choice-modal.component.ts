import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ContextService} from '../../../service/context/context.service';
import {RootContextDto} from '../../../service/context/context.dto';
import {NewTeamComponent} from '../../team/new-team/new-team.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root-context-choice-modal',
  templateUrl: './root-context-choice-modal.component.html'
})
export class RootContextChoiceModalComponent implements OnInit, OnDestroy {
  roots: Array<RootContextDto>;
  selectedId: string;
  rootSubscription: Subscription;

  constructor(private dialogRef: MatDialogRef<NewTeamComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ContextService) {
  }

  ngOnInit() {
    this.rootSubscription = this.service.getRoots().subscribe(contexts => this.roots = contexts);
    this.selectedId = this.service.selectedRoot;
  }

  ngOnDestroy() {
    this.rootSubscription.unsubscribe();
  }

  choose() {
    if (this.selectedId) {
      this.service.selectedRoot = this.selectedId;
    }
    this.dialogRef.close(this.selectedId);
  }

  close() {
    this.dialogRef.close();
  }

}
