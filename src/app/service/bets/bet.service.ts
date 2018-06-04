import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {FirestoreCollectionService} from '../firestore-collection.service';
import {BetDto} from './bet.dto';
import {Match} from '../matches/match.dto';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class BetService extends FirestoreCollectionService<BetDto> {

  constructor(private store: AngularFirestore, private authService: AuthService) {
    super();
  }

  protected getItemCollection(params: string[]): AngularFirestoreCollection<BetDto> {
    return this.store.collection('rootContext').doc(params[0]).collection<Match>('matchContext')
      .doc(params[1]).collection<BetDto>('bets', ref => ref.where('user', '==', this.authService.user.id));
  }

  protected transformToUpdateDbObject(item: BetDto) {
    return {
      bet: item.bet,
    };
  }
  protected transformToDbObject(item: BetDto): any {
    return {
      user: item.user || this.authService.user.id,
      matchId: item.matchId,
      bet: item.bet,
      point: item.point || 0
    };
  }

  protected transformToItem(dbObject: any, id: string): BetDto {
    return new BetDto(id, dbObject.user, dbObject.matchId, dbObject.bet, dbObject.point);
  }
}
