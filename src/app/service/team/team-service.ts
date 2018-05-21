import {Injectable} from '@angular/core';
import {Team} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class TeamService {
  private itemsCollection: AngularFirestoreCollection<Team>;

  constructor(protected store: AngularFirestore) {
    this.itemsCollection = this.store.collection<Team>('team');
  }

  getItems(): Observable<Array<Team>> {
    // return this.itemsCollection.valueChanges();
    return this.itemsCollection.snapshotChanges().pipe(map(actions => {
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
      return this.itemsCollection.doc(item.id).update(dbObject);
    } else {
      return this.itemsCollection.add(dbObject);
    }
  }

  deleteItem(item: Team): Promise<void> {
    return this.itemsCollection.doc(item.id).delete();
  }
}
