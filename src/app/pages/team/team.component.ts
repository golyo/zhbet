import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TeamService} from '../../service/team/team-service';
import {Team} from '../../service/matches/match.dto';
import {NewTeamComponent} from './new-team/new-team.component';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {

  teams: Array<Team>
  dataSource: MatTableDataSource<Team>;
  displayedColumns = ['name', 'point', 'ops'];
  subscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: TeamService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subscription = this.service.getItems().subscribe(teams => {
      this.teams = teams;
      this.dataSource = new MatTableDataSource<Team>(teams);
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  delete(team: Team) {
    this.service.deleteItem(team);
  }

  openDialog(team?: Team) {
    this.dialog.open(NewTeamComponent, {
      width: '500px',
      data: { team: team }
    });
  }
}
