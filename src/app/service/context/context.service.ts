import {Injectable} from '@angular/core';
import {MatchContext, MatchContextDto} from './context.dto';
import {Match, MatchResult} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';

const CONTEXT_KEY = 'ZHBET_CONTEXT';

@Injectable()
export class ContextService {
  private itemsCollection: AngularFirestoreCollection<MatchContextDto>;
  private _selectedRoot: string;
  private contextSubject = new BehaviorSubject<MatchContext>(undefined);

  constructor(protected store: AngularFirestore) {
    this.itemsCollection = this.store.collection<MatchContextDto>('matchContext');
    this._selectedRoot = localStorage.getItem(CONTEXT_KEY);
    this.changeContext();
  }

  getRoots(): Observable<Array<MatchContextDto>> {
    return this.store.collection<MatchContextDto>('matchContext', ref => ref.where('parent', '==', 'ROOT'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as MatchContextDto;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  getSelectedContext(): Observable<MatchContext> {
    if (!this.selectedRoot) {
      throwError('select root first');
    } else {
      return this.contextSubject.asObservable();
    }
  }


  get selectedRoot() {
    return this._selectedRoot;
  }

  set selectedRoot(root: string) {
    this._selectedRoot = root;
    localStorage.setItem(CONTEXT_KEY, root);
    this.changeContext();
  }

  addContext(root: string, parent: string, name: string, year?: number): Observable<void> {
    const isRoot = parent === 'ROOT';
    if (isRoot) {
      name = year + ' ' + name;
    }
    const id = isRoot ? name.replace(' ', '_') : root + '_' + name.replace(' ', '_');
    const dbObject = {
      root: root || id,
      parent: parent,
      name: name,
    } as MatchContextDto;
    if (year) {
      dbObject.year = year;
    }
    return fromPromise(this.itemsCollection.doc(id).set(dbObject)).pipe(map(() => {
      const context = new MatchContext(id, dbObject.name, dbObject.year);
      if (parent === 'ROOT') {
        this._selectedRoot = context.id;
        localStorage.setItem(CONTEXT_KEY, context.id);
        this.contextSubject.next(context);
      }
    }));
  }

  private changeContext() {
    console.log('CHANGE CONTEXT');
    if (this._selectedRoot && (!this.contextSubject.value || this.contextSubject.value.id !== this._selectedRoot)) {
      this.store.collection<MatchContextDto>('matchContext', ref => ref.where('root', '==', this.selectedRoot))
        .snapshotChanges().pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as MatchContextDto;
          data.id = a.payload.doc.id;
          return data;
        });
      })).subscribe(contexts => {
        this.contextSubject.next(this.buildRootContext(contexts));
      });
    }
  }

  private buildRootContext(contexts: Array<MatchContextDto>): MatchContext {
    if (contexts.length === 0) {
      return null;
    } else {
      const root = MatchContext.createFromDto(contexts.find(context => context.id === contexts[0].root));
      this.buildMatchContextChildren(root, contexts);
      return root;
    }
  }

  private buildMatchContextChildren(context: MatchContext, contexts: Array<MatchContextDto>) {
    context.children = contexts.filter(c => c.parent === context.id).map(contextDto => MatchContext.createFromDto(contextDto));
    context.children.forEach(child => {
      child.parent = context;
      this.buildMatchContextChildren(child, contexts);
    });
  }

  private saveMatchResult(match: Match, result: MatchResult) {
    match.result = result;
    // TODO save match;
    // TODO get match bets;
    const matchBets: Array<MatchResult> = [];
    // TODO calculate and save points
  }
}
