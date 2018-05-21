import {Component, OnInit, ViewChild} from '@angular/core';
import {TeamService} from '../../service/team/team-service';
import {Team} from '../../service/matches/match.dto';
import {NewTeamComponent} from './new-team/new-team.component';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teams: Array<Team>
  dataSource: MatTableDataSource<Team>;
  displayedColumns = ['name', 'point', 'ops'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: TeamService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.service.getItems().subscribe(teams => {
      console.log('teams changed', teams);
      this.teams = teams;
      this.dataSource = new MatTableDataSource<Team>(teams);
      this.dataSource.sort = this.sort;
    });
  }

  delete(team: Team) {
    this.service.deleteItem(team);
  }

  openDialog(team?: Team) {
    let dialogRef = this.dialog.open(NewTeamComponent, {
      width: '500px',
      // height: '250px',
      data: { team: team }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
