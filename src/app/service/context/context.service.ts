import {Injectable} from '@angular/core';
import {MatchContext, MatchContextDto, RootContext, RootContextDto} from './context.dto';
import {Match, MatchResult} from '../matches/match.dto';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/internal/operators';

const CONTEXT_KEY = 'ZHBET_CONTEXT';

@Injectable()
export class ContextService {
  private rootContextCollection: AngularFirestoreCollection<MatchContextDto>;
  private _selectedRoot: string;
  private contextSubscription: Subscription;
  private contextSubject = new BehaviorSubject<RootContext>(undefined);

  constructor(private store: AngularFirestore) {
    this.rootContextCollection = this.store.collection<MatchContextDto>('rootContext');
    this._selectedRoot = localStorage.getItem(CONTEXT_KEY) || '2018_VB';
    this.changeContext();
  }

  getRoots(): Observable<Array<RootContextDto>> {
    return this.store.collection<RootContextDto>('rootContext').valueChanges().pipe(tap(rootDtos => {
      rootDtos.forEach(dto => {
        dto.id = dto.year + '_' + dto.type;
        dto.name = dto.year + ' ' + dto.type;
      });
    }));
  }

  getSelectedContext(): Observable<RootContext> {
    return this.contextSubject.asObservable();
  }

  updateRootStart(rootId: string, start: Date): Promise<any> {
    return this.store.collection<RootContextDto>('rootContext').doc(rootId).update({
      start: start
    });
  }

  get selectedRoot() {
    return this._selectedRoot;
  }

  set selectedRoot(root: string) {
    this._selectedRoot = root;
    localStorage.setItem(CONTEXT_KEY, root);
    this.changeContext();
  }

  addRootContext(year: number, type: string): void {
    const id = year + '_' + type;
    const dbObject = {
      year: year,
      type: type
    };
    this.rootContextCollection.doc(id).set(dbObject).then(() => {
      this.selectedRoot = id;
      this.contextSubject.next(new RootContext(type, year));
    });
  }

  addContext(parent: string, name: string): void {
    const id = this._selectedRoot + '_' + name.replace(' ', '_');
    const dbObject = {
      parent: parent,
      name: name,
    };
    this.rootContextCollection.doc(this._selectedRoot).collection('matchContext').doc(id).set(dbObject).then();
  }

  removeContext(id): Promise<void> {
    return this.rootContextCollection.doc(this._selectedRoot).collection('matchContext').doc(id).delete();
  }

  private changeContext() {
    if (this._selectedRoot && (!this.contextSubject.value || this.contextSubject.value.id !== this._selectedRoot)) {
      if (this.contextSubscription) {
        this.contextSubscription.unsubscribe();
      }
      this.rootContextCollection.doc<RootContextDto>(this._selectedRoot).valueChanges().subscribe(rootDto => {
        if (rootDto) {
          this.contextSubscription = this.store.collection<MatchContextDto>('rootContext/' + this._selectedRoot + '/matchContext')
            .valueChanges().pipe(tap(contexts => {
            contexts.forEach((context) => {
              context.id = this._selectedRoot + '_' + context.name.replace(' ', '_');
            });
          })).subscribe(contexts => {
            const root = RootContext.fromDto(rootDto);
            this.buildRootContext(root, contexts);
            this.contextSubject.next(root);
          });
        } else {
          // not found
          delete this._selectedRoot;
        }
      });
    }
  }

  private buildRootContext(root: RootContext, contexts: Array<MatchContextDto>): void {
    if (contexts.length > 0) {
      this.buildMatchContextChildren(root, contexts);
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
