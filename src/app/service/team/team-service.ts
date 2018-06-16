import {Injectable} from '@angular/core';
import {Team} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {FirestoreCollectionService} from '../firestore-collection.service';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {TeamBetDto} from '../bets/bet.dto';
import {BehaviorDefinedSubject} from '../../util/behavior-defined-subject';

@Injectable()
export class TeamService extends FirestoreCollectionService<Team> {

  private teamBetSubject = new BehaviorDefinedSubject<Array<TeamBetDto>>();

  constructor(private store: AngularFirestore, private auth: AuthService) {
    super();
  }

  public getTeamBet(rootContext: string): Observable<TeamBetDto> {
    return this.store.collection(`rootContext/${rootContext}/teamBet/`).doc<TeamBetDto>(this.auth.user.id).valueChanges();
  }

  getTeamBets(rootContext): Observable<Array<TeamBetDto>> {
    if (!this.teamBetSubject.value) {
      // const query: QueryFn = all ? undefined : ref => ref.where('context', '==', this._user.context);
      this.store.collection<TeamBetDto>(`rootContext/${rootContext}/teamBet/`).valueChanges().subscribe(teamBets => {
        this.teamBetSubject.next(teamBets);
      });
    }
    return this.teamBetSubject.asObservable();
  }

  addTeamPoint(team: Team, diff: number): Promise<any> {
    return this.getFinalCollection().doc(team.id).update({
      point: team.point + diff
    });
  }

  public updateTeamBet(rootContext, teamBet: TeamBetDto): Promise<any> {
    const userId = this.auth.user.id;
    const dbObject = {
      userId: userId,
      teams: teamBet.teams
    };
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
