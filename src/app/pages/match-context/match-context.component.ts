import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {ContextService} from '../../service/context/context.service';
import {Team} from '../../service/matches/match.dto';
import {NewTeamComponent} from '../team/new-team/new-team.component';
import {RootContextChoiceModalComponent} from './root-context-choice-modal/root-context-choice-modal.component';
import {MatchContext, RootContext} from '../../service/context/context.dto';
import {NewContextModalComponent} from './new-context-modal/new-context-modal.component';
import {NewRootContextModalComponent} from './new-root-context-modal/new-root-context-modal.component';

@Component({
  selector: 'app-match-context',
  templateUrl: './match-context.component.html',
  styleUrls: ['./match-context.component.css']
})
export class MatchContextComponent implements OnInit {
  context: RootContext;

  constructor(private service: ContextService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.service.getSelectedContext().subscribe(context => {
      this.context = context;
    });
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
