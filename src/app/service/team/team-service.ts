import {Injectable} from '@angular/core';
import {Team} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ContextService} from '../context/context.service';

@Injectable()
export class TeamService {

  constructor(private store: AngularFirestore, private contextService: ContextService) {
  }

  getItems(): Observable<Array<Team>> {
    return this.getItemCollection().snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Team;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  updateItem(item: Team): Promise<any> {
    const dbObject = {
      name: item.name,
      point: item.point || 0
    } as Team;
    if (item.id) {
      return this.getItemCollection().doc(item.id).update(dbObject);
    } else {
      return this.getItemCollection().add(dbObject);
    }
  }

  deleteItem(item: Team): Promise<void> {
    return this.getItemCollection().doc(item.id).delete();
  }

  private getItemCollection(): AngularFirestoreCollection<Team> {
    return this.store.collection<Team>('rootContext/' + this.contextService.selectedRoot + '/teams');
  }
}
