import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {Match, MatchResult, Team} from './match.dto';
import {FirestoreCollectionService} from '../firestore-collection.service';

@Injectable()
export class MatchService extends FirestoreCollectionService<Match> {

  constructor(private store: AngularFirestore) {
    super();
  }

  protected getItemCollection(params: string[]): AngularFirestoreCollection<Match> {
    return this.store.collection('rootContext').doc(params[0]).collection<Match>('matchContext')
      .doc(params[1]).collection<Match>('matches');
  }

  protected transformToDbObject(item: Match): any {
    const object = {
      home: item.home,
      away: item.away,
      start: item.start
    } as any;
    if (item.result) {
      object.result = {
        home: item.result.home,
        away: item.result.away
      };
    }
    return object;
  }

  protected transformToItem(dbObject: any, id: string): Match {
    return new Match(id, dbObject.home, dbObject.away, new Date(dbObject.start.seconds * 1000),
      new MatchResult(dbObject.result.home, dbObject.result.away));
  }
}
