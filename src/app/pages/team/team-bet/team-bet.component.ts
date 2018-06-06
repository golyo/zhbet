import {Team} from '../../../service/matches/match.dto';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TeamService} from '../../../service/team/team-service';
import {ContextService} from '../../../service/context/context.service';
import {Subscription} from 'rxjs';
import {TeamBetDto} from '../../../service/bets/bet.dto';
import {SpinnerService} from '../../../components/spinner/spinner.service';
import {MatSnackBar} from '@angular/material';
import {RootContext} from '../../../service/context/context.dto';

class TeamBetVo {
  team: string;
  constructor(team: string) {
    this.team = team;
  }
}
@Component({
  selector: 'app-team-bet',
  templateUrl: './team-bet.component.html',
  styleUrls: ['./team-bet.component.css']
})
export class TeamBetComponent implements OnInit, OnDestroy {
  teams: Array<Team>;
  teamBet: TeamBetDto;
  isRunning: boolean;
  selectedRoot: RootContext;
  teamsSubscription: Subscription;
  teamBetSubscription: Subscription;
  contextSubscription: Subscription;
  editedBets: Array<TeamBetVo>;
  constructor(private contextService: ContextService, private teamService: TeamService, private spinner: SpinnerService,
              private snack: MatSnackBar) {
  }

  ngOnInit() {
    this.contextSubscription = this.contextService.getSelectedContext().subscribe(selectedRoot => {
      if (selectedRoot) {
        this.selectedRoot = selectedRoot;
        this.isRunning = new Date().getTime() > this.selectedRoot.start.getTime();
      }
    });
    this.teamsSubscription = this.teamService.getItems(this.contextService.selectedRoot).subscribe((teams) => {
      if (teams) {
        this.teams = teams;
        this.teamBetSubscription = this.teamService.getTeamBet(this.contextService.selectedRoot).subscribe(teamBet => {
          this.teamBet = teamBet || new TeamBetDto();
          this.editedBets = this.teamBet.teams.map((bet => {
            return new TeamBetVo(bet);
          }));
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.contextSubscription) {
      this.contextSubscription.unsubscribe();
    }
    if (this.teamsSubscription) {
      this.teamsSubscription.unsubscribe();
    }
    if (this.teamBetSubscription) {
      this.teamBetSubscription.unsubscribe();
    }
  }

  save() {
    this.spinner.show();
    this.teamBet.teams = this.editedBets.map(vo => {
      return vo.team;
    });
    this.teamService.updateTeamBet(this.contextService.selectedRoot, this.teamBet).then(() => {
      this.spinner.hide();
      this.snack.open('Team bets saved');
    });
  }

  cancel() {
    this.editedBets = [].concat(this.teamBet.teams);
  }
}
