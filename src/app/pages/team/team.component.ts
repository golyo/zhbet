import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TeamService} from '../../service/team/team-service';
import {Team} from '../../service/matches/match.dto';
import {NewTeamComponent} from './new-team/new-team.component';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';
import {ContextService} from '../../service/context/context.service';
import {RootContext} from '../../service/context/context.dto';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {
  selectedContext: RootContext;
  teams: Array<Team>
  dataSource: MatTableDataSource<Team>;
  displayedColumns = ['name', 'point', 'ops'];
  subscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;

  private contextSubscription: Subscription;
  constructor(private teamService: TeamService, private contextService: ContextService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.contextSubscription = this.contextService.getSelectedContext().subscribe(context => {
      this.selectedContext = context;
    });
    this.subscription = this.teamService.getItems(this.contextService.selectedRoot).subscribe(teams => {
      this.teams = teams;
      this.dataSource = new MatTableDataSource<Team>(teams);
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.contextSubscription.unsubscribe();
  }

  delete(team: Team) {
    this.teamService.delete(team.id).then();
  }

  openDialog(team?: Team) {
    this.dialog.open(NewTeamComponent, {
      width: '500px',
      data: { team: team }
    });
  }
}
