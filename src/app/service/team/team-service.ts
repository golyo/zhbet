import {Injectable} from '@angular/core';
import {Team} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {FirestoreCollectionService} from '../firestore-collection.service';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {TeamBetDto} from '../bets/bet.dto';

@Injectable()
export class TeamService extends FirestoreCollectionService<Team> {

  constructor(private store: AngularFirestore, private auth: AuthService) {
    super();
  }

  public getTeamBet(rootContext: string): Observable<TeamBetDto> {
    return this.store.collection(`rootContext/${rootContext}/teamBet/`).doc<TeamBetDto>(this.auth.user.id).valueChanges();
  }

  public updateTeamBet(rootContext, teamBet: TeamBetDto): Promise<any> {
    const userId = this.auth.user.id;
    const dbObject = {
      userId: userId,
      teams: teamBet.teams
    };
    console.log('Try to save', dbObject);
    return this.store.collection(`rootContext/${rootContext}/teamBet/`).doc(userId).set(dbObject);
  }

  protected getItemCollection(params: string[]): AngularFirestoreCollection<Team> {
    return this.store.collection<Team>('rootContext/' + params[0] + '/teams');
  }

  protected transformCollection(items: Array<Team>): Array<Team> {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  protected transformToDbObject(item: Team): any {
    return {
      name: item.name,
      point: item.point || 0
    };
  }

  protected transformToItem(dbObject: any, id: string): Team {
    return new Team(id, dbObject.name, dbObject.point);
  }
}
