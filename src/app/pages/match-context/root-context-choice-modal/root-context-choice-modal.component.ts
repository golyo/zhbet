import {Component, Inject, OnInit} from '@angular/core';
import {ContextService} from '../../../service/context/context.service';
import {MatchContextDto} from '../../../service/context/context.dto';
import {NewTeamComponent} from '../../team/new-team/new-team.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-root-context-choice-modal',
  templateUrl: './root-context-choice-modal.component.html'
})
export class RootContextChoiceModalComponent implements OnInit {
  roots: Array<MatchContextDto>;
  selectedId: string;

  constructor(private dialogRef: MatDialogRef<NewTeamComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private service: ContextService) {
  }

  ngOnInit() {
    this.service.getRoots().subscribe(contexts => this.roots = contexts);
    this.selectedId = this.service.selectedRoot;
  }

  choose() {
    this.dialogRef.close(this.selectedId);
  }

  close() {
    this.dialogRef.close();
  }

}
