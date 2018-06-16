import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Match, MatchFlag, MatchResult, Team} from './match.dto';
import {FirestoreCollectionService} from '../firestore-collection.service';
import {TeamService} from '../team/team-service';
import {Subscription} from 'rxjs';
import {BetDto, MatchResultBet, TeamBetDto} from '../bets/bet.dto';
import {User, UserPointDiff} from '../auth/user.dto';
import {POINT_RULE} from '../bets/bet-point-rules';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class MatchService extends FirestoreCollectionService<Match> {
  private teamSubscription: Subscription;

  constructor(private store: AngularFirestore, private teamService: TeamService, private authService: AuthService) {
    super();
  }

  updateResult(match: Match): Promise<boolean> {
    // Update team points
    // Update bet points
    // Update User points
    return new Promise((resolve, reject) => {
      const authSubscription = this.authService.getUsers().subscribe(users => {
        console.log('USERS loaded', users);
        const teamSubscription = this.teamService.getTeamBets(this.getOrigParams()[0]).subscribe(teamBets => {
          console.log('teamBets loaded', teamBets);
          const betSubscription = this.store.collection('rootContext').doc(this.getOrigParams()[0]).collection<BetDto>('matchContext')
            .doc(this.getOrigParams()[1]).collection<BetDto>('bets', ref => ref.where('matchId', '==', match.id))
            .valueChanges().subscribe(bets => {
              console.log('Bets loaded', bets);
              this.updateUsersAndTeam(users, teamBets, bets, match).then(() => resolve(true));
              authSubscription.unsubscribe();
              teamSubscription.unsubscribe();
              betSubscription.unsubscribe();
          });
        });
      });
    });
    // this.store.collection(`rootContext/${this.getOrigParams()[0]}/teamBet/`).
    // this.store.collection(`this.store.collection(\`rootContext/${rootContext}/teamBet/\`)`);
    // return this.getFinalCollection().doc(match.id).update({result: this.transformResultToObject(match.result)});
  }

  private updateUsersAndTeam(users: Array<User>, teamBets: Array<TeamBetDto>, bets: Array<BetDto>, match: Match): Promise<any> {
    const changes = this.getUserMatchChanges(users, teamBets, bets, match);
    const userCollection = this.store.collection('users');
    const batch = this.store.firestore.batch();
    changes.forEach(change => {
      batch.update(userCollection.doc(change.userId).ref, {
        teamPoint: change.teamPoint,
        betPoint: change.betPoint
      });
    });
    const path = `rootContext/${this.getOrigParams()[0]}/matchContext/${this.getOrigParams()[1]}/matches/${match.id}`;
    console.log('Try to update match result: ', match.result, path);
    batch.update(this.store.doc(path).ref, {result: this.transformResultToObject(match.result)});
    return batch.commit();
  }
/*
  private updateTeamPoints(rootId: string, match: Match) {
    this.teamSubscription = this.teamService.getItems(rootId).subscribe(teams => {
      if (teams) {
        this.teamSubscription.unsubscribe();
        if (match.result.result === MatchFlag.HOME) {
          this.addTeamPoint(teams, match.home, WIN_TEAM_POINT);
        } else if (match.result.result === MatchFlag.AWAY) {
          this.addTeamPoint(teams, match.away, WIN_TEAM_POINT);
        } else {
          this.addTeamPoint(teams, match.home, DRAW_TEAM_POINT);
          this.addTeamPoint(teams, match.away, DRAW_TEAM_POINT);
        }
      }
    });
  }

  private addTeamPoint(teams: Array<Team>, teamName: string, point: number) {
    const team = teams.find(team => team.name === teamName);
    console.log('ADD team point', team, point);
    // this.teamService.addTeamPoint(team, point).then();
  }
*/
  protected getItemCollection(params: string[]): AngularFirestoreCollection<Match> {
    return this.store.collection('rootContext').doc(params[0]).collection<Match>('matchContext')
      .doc(params[1]).collection<Match>('matches');
  }

  protected transformCollection(items: Array<Match>): Array<Match> {
    return items.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  protected transformToDbObject(item: Match): any {
    const object = {
      home: item.home,
      away: item.away,
      start: item.start
    } as any;
    if (item.result) {
      object.result = this.transformResultToObject(item.result);
    }
    return object;
  }

  protected transformToItem(dbObject: any, id: string): Match {
    const match = new Match(id, dbObject.home, dbObject.away, new Date(dbObject.start.seconds * 1000));
    if (dbObject.result) {
      match.result = new MatchResult(dbObject.result.home, dbObject.result.away);
    }
    return match;
  }

  private transformResultToObject(result: MatchResult): Object {
    return result ? {
      home: result.home,
      away: result.away
    } : null;
  }

  private getUserMatchChanges(users: Array<User>, teamBets: Array<TeamBetDto>, bets: Array<BetDto>, match: Match): Array<UserPointDiff> {
    const result = new Array<UserPointDiff>();
    users.forEach(user => {
      const teamBet = teamBets.find(teamBet => teamBet.userId === user.id);
      const bet = bets.find(bet => bet.user === user.id);
      const userDiff = new UserPointDiff(user.id);
      if (teamBet) {
        userDiff.teamPoint = POINT_RULE.getTeamBetPoint(teamBet, match);
      }
      if (bet) {
        userDiff.betPoint = POINT_RULE.getMatchBetPoint(MatchResult.fromString(bet.bet), match);
      }
      if (userDiff.teamPoint || userDiff.betPoint) {
        userDiff.teamPoint += (user.teamPoint || 0);
        userDiff.betPoint += (user.betPoint || 0);
        result.push(userDiff);
      }
    });
    return result;
  }

}
