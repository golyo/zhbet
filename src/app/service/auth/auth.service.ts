import {Injectable} from '@angular/core';
import {User} from './user.dto';
import {Observable, Subject} from 'rxjs';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {map} from 'rxjs/internal/operators';
import {QueryFn} from 'angularfire2/firestore/interfaces';
import {BetDto, TeamBetDto} from '../bets/bet.dto';
import {Match} from '../matches/match.dto';

const USER_KEY = 'zhbet_user';
export const ADMIN_ROLE = 'ADMIN';

@Injectable()
export class AuthService {
  private _user: User;
  private userChanged = new Subject<User>();

  constructor(private afAuth: AngularFireAuth, protected store: AngularFirestore) {
    const val = localStorage.getItem(USER_KEY) as any;
    this._user = val && val.length > 0 ? this.transformToUser(JSON.parse(val), val.id) : null;
    this.afAuth.authState.subscribe((fUser) => {
      this.onAuthStateChanged(fUser);
    });
  }

  get user(): User {
    return this._user;
  }

  getUsers(all: boolean): Observable<Array<User>> {
    const query: QueryFn = all ? undefined : ref => ref.where('context', '==', this._user.context);
    return this.store.collection('users', query)
      .snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return this.transformToUser(a.payload.doc.data(), a.payload.doc.id);
      }).sort((a, b) => {
        return a.point - b.point;
      });
    }));
  }

  setPaid(user: User): Promise<any> {
    return this.store.collection('users').doc(user.id).update({
      context: 'Apu Kezdődik'
    });
  }
  updateUserPoint(user: User, addBetPoint: number, addTeamPoint): Promise<any> {
    return this.store.collection('users').doc(user.id).update({
      point: user.point + addBetPoint + addTeamPoint,
      teamPoint: user.teamPoint + addTeamPoint,
      betPoint: user.betPoint + addBetPoint
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((authRequest) => {
      this.onAuthStateChanged(authRequest.user);
    });
  }

  async logout(): Promise<any> {
    await this.afAuth.auth.signOut();
    delete this._user;
    this.userChanged.next(undefined);
    localStorage.setItem(USER_KEY, '');
  }

  invalidate() {
    this.store.collection(`rootContext/${'2018_VB'}/teamBet/`).doc<TeamBetDto>(this.user.id).delete().then( () => {
    });
    this.store.collection('rootContext').doc('2018_VB').collection<Match>('matchContext')
      .doc('2018_VB_Group_A').collection<BetDto>('bets', ref => ref.where('user', '==', this._user.id))
      .snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return a.payload.doc.id;
      });
    })).subscribe(ids => {
      ids.forEach(id => {
        this.store.collection(`rootContext/${'2018_VB'}/matchContext/2018_VB_Group_A/bets`).doc(id).delete().then();
      });
    });
    this.store.collection('users').doc(this._user.id).delete().then();
  }

  getUserChangeObservable(): Observable<User> {
    return this.userChanged.asObservable();
  }

  addUserWithName(name: string): Promise<void> {
    if (this._user.id) {
      return new Promise((resolve, reject) => {
        this.store.collection('users').doc(this._user.id).update({ name: name }).then(() => {
          this._user.name = name;
          localStorage.setItem(USER_KEY, JSON.stringify(this._user));
          resolve();
        }).catch((e) => reject(e));
      });
    } else {
      const dbObject = {
        name: name,
        email: this._user.email,
        roles: this._user.roles || []
      };
      return new Promise((resolve, reject) => {
        this.store.collection('users').add(dbObject).then(userDoc => {
          this._user.name = name;
          this._user.id = userDoc.id;
          localStorage.setItem(USER_KEY, JSON.stringify(this._user));
          resolve();
        }).catch((e) => reject(e));
      });
    }
  }

  private transformToUser(dbObject: any, id: string) {
    return new User(id, dbObject.name, dbObject.email, dbObject.context, dbObject.point, dbObject.teamPoint,
      dbObject.betPoint, dbObject.roles);
  }
  private onAuthStateChanged(fUser: firebase.User) {
    if (!fUser) {
      // User logged out
      delete this._user;
      this.userChanged.next(null);
    } else if (!this._user || !this._user.id || this._user.email !== fUser.email) {
      // USer changed
      this.store.collection('users', ref => ref.where('email', '==', fUser.email))
        .snapshotChanges().pipe(map(users => users.map(userDoc => {
          return this.transformToUser(userDoc.payload.doc.data(), userDoc.payload.doc.id);
      })))
        .subscribe((users) => {
          if (users.length > 0) {
            this._user = users[0];
          } else {
            this._user = new User(null, fUser.displayName, fUser.email);
          }
          localStorage.setItem(USER_KEY, JSON.stringify(this._user));
          this.userChanged.next(this._user);
        });
    } else {
      this.userChanged.next(this._user);
    }
  }
}
