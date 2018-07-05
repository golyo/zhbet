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
import {MatchContext} from '../context/context.dto';

@Injectable()
export class MatchService extends FirestoreCollectionService<Match> {
  private teamSubscription: Subscription;

  constructor(private store: AngularFirestore, private teamService: TeamService, private authService: AuthService) {
    super();
  }

  addTeamForwardPointsToSelectedContext(): Promise<boolean> {
    console.log('Add teamForwardPoints', this.getOrigParams());
    return new Promise((resolve, reject) => {
      const authSubscription = this.authService.getUsers().subscribe(users => {
        console.log('USERS loaded', users);
        const teamSubscription = this.teamService.getTeamBets(this.getOrigParams()[0]).subscribe(teamBets => {
          console.log('teamBets loaded', teamBets);
          const matchSubscription = this.getLoadedItems().subscribe(matches => {
              console.log('matches loaded', matches);
              this.updateTeamForwardPoints(users, teamBets, matches).then(() => resolve(true));
              authSubscription.unsubscribe();
              teamSubscription.unsubscribe();
              if (matchSubscription) {
                matchSubscription.unsubscribe();
              }
            });
        });
      });
    });
  }
  updateResult(match: Match): Promise<boolean> {
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
  }

  private updateTeamForwardPoints(users: Array<User>, teamBets: Array<TeamBetDto>, matches: Array<Match>): Promise<any> {
    const userCollection = this.store.collection('users');
    const batch = this.store.firestore.batch();
    users.forEach(user => {
      const extraPoint = this.getTeamForwardPoint(user.id, teamBets, matches);
      if (extraPoint) {
        console.log('Add extra point to user', user.id, user.name, extraPoint);
        batch.update(userCollection.doc(user.id).ref, {
          teamPoint: user.teamPoint + extraPoint
        });
      }
    });
    return batch.commit();
  }

  private getTeamForwardPoint(userId: string, teamBets: Array<TeamBetDto>, matches: Array<Match>): number {
    const bet = teamBets.find((bet => bet.userId === userId));
    let teamForward = 0;
    if (bet) {
      matches.forEach(match => {
        if (bet.teams.findIndex(team => team === match.home) >= 0 || bet.teams.findIndex(team => team === match.away) >= 0) {
          teamForward += POINT_RULE.teamForward;
        }
      });
    }
    return teamForward;
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
