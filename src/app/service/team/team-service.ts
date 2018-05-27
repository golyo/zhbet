import {Injectable} from '@angular/core';
import {Team} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ContextService} from '../context/context.service';
import {FirestoreCollectionService} from '../firestore-collection.service';

@Injectable()
export class TeamService extends FirestoreCollectionService<Team> {

  constructor(private store: AngularFirestore) {
    super();
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
