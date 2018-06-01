import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Match, MatchResult} from './match.dto';
import {FirestoreCollectionService} from '../firestore-collection.service';

@Injectable()
export class MatchService extends FirestoreCollectionService<Match> {

  constructor(private store: AngularFirestore) {
    super();
  }

  updateResult(match: Match): Promise<void> {
    // TODO UPDATE BETS
    return this.getFinalCollection().doc(match.id).update({result: this.transformResultToObject(match.result)});
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
}
