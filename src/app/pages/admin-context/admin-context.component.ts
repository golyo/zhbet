import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContextService} from '../../service/context/context.service';
import {MatchContext, RootContext} from '../../service/context/context.dto';
import {NewRootContextModalComponent} from './new-root-context-modal/new-root-context-modal.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RootContextChoiceModalComponent} from './root-context-choice-modal/root-context-choice-modal.component';
import {Subscription} from 'rxjs';
import {NewContextModalComponent} from './new-context-modal/new-context-modal.component';
import {MatchService} from '../../service/matches/match.service';
import {SpinnerService} from '../../components/spinner/spinner.service';
import {EditMatchComponent} from '../matches/edit-match/edit-match.component';
import {TeamService} from '../../service/team/team-service';
import {Team} from '../../service/matches/match.dto';

@Component({
  selector: 'app-admin-context',
  templateUrl: './admin-context.component.html'
})
export class AdminContextComponent implements OnInit, OnDestroy {

  context: RootContext;
  selectedContext: MatchContext;
  teams: Array<Team>;
  private contextSubscription: Subscription;


  constructor(private contextService: ContextService, private matchService: MatchService, private teamService: TeamService,
              private dialog: MatDialog, private snack: MatSnackBar, private spinner: SpinnerService) {
  }

  ngOnInit() {
    this.contextSubscription = this.contextService.getSelectedContext().subscribe(context => {
      if (!this.context || this.context.id !== context.id) {
        this.selectedContext = null;
      }
      this.context = context;
    });
    this.teamService.getItems(this.contextService.selectedRoot).subscribe(teams => {
      this.teams = teams;
    });
  }

  ngOnDestroy() {
    this.contextSubscription.unsubscribe();
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
      this.contextService.removeContext(this.selectedContext.id).then(() => {
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
    this.dialog.open(EditMatchComponent, {
      width: '500px'
    });
  }

  addTeamForwardPoints() {
    this.matchService.addTeamForwardPointsToSelectedContext().then(() => {
      this.snack.open('Team forward points added!', '', {
        duration: 3000
      });
    });
  }

  onSelectNode(context: MatchContext) {
    this.selectedContext = context;
  }
}
