import {Injectable} from '@angular/core';
import {User} from './user.dto';
import {Observable, Subject} from 'rxjs';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {map} from 'rxjs/internal/operators';

const USER_KEY = 'zhbet_user';
export const ADMIN_ROLE = 'ADMIN';

@Injectable()
export class AuthService {
  private _user: User;
  private userChanged = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth, protected store: AngularFirestore) {
    const val = localStorage.getItem(USER_KEY);
    this._user = val && val.length > 0 ? JSON.parse(val) : null;
    this.afAuth.authState.subscribe((fUser) => {
      this.onAuthStateChanged(fUser);
    });
  }

  get user(): User {
    return this._user;
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((authRequest) => {
      this.onAuthStateChanged(authRequest.user);
    });
  }

  async logout(): Promise<any> {
    await this.afAuth.auth.signOut();
    delete this._user;
    localStorage.setItem(USER_KEY, '');
  }

  getUserChangeObservable(): Observable<boolean> {
    return this.userChanged.asObservable();
  }

  private onAuthStateChanged(fUser: firebase.User) {
    if (!fUser) {
      // User logged out
      delete this._user;
      this.userChanged.next(false);
    } else if (!this._user || this._user.email !== fUser.email) {
      // USer changed
      this.store.collection('users', ref => ref.where('email', '==', fUser.email))
        .snapshotChanges().pipe(map(users => users.map(user => user.payload.doc.data() as User)))
        .subscribe((users) => {
          if (users.length > 0) {
            this._user = users[0];
          } else {
            this._user = new User(fUser.displayName, fUser.email, []);
          }
          console.log('AUTH state changed', this._user);
          localStorage.setItem(USER_KEY, JSON.stringify(this._user));
          this.userChanged.next(true);
        });
    } else {
      this.userChanged.next(true);
    }
  }
}
