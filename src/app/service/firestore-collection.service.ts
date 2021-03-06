import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AngularFirestoreCollection} from 'angularfire2/firestore';
import {map} from 'rxjs/operators';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import {BehaviorDefinedSubject} from '../util/behavior-defined-subject';

export abstract class FirestoreCollectionService<T> {
  protected collectionSubject = new BehaviorDefinedSubject<Array<T>>();

  private subscription: Subscription;
  private prevParams: string[];

  getItems(...params: string[]): Observable<Array<T>> {
    if (this.isChanged(params)) {
      this.collectionSubject.next(undefined);
      this.prevParams = params;
      this.resetCollectionSubscription();
      this.subscription = this.transformFirestoreCollection(this.getItemCollection(params)).subscribe(items => {
        this.collectionSubject.next(this.transformCollection(items));
      });
    }
    return this.collectionSubject.asObservable();
  }

  getLoadedItems(): Observable<Array<T>> {
    return this.collectionSubject.asObservable();
  }

  update(id: string, item: T): Promise<void> {
    return this.getFinalCollection().doc(id).update(this.transformToUpdateDbObject(item));
  }

  add(item: T): Promise<DocumentReference> {
    return this.getFinalCollection().add(this.transformToDbObject(item) as T);
  }

  delete(id: string): Promise<void> {
    return this.getFinalCollection().doc(id).delete();
  }

  resetCollectionSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      delete this.subscription;
    }
  }

  protected getOrigParams(): string[] {
    return this.prevParams;
  }

  protected transformToUpdateDbObject(item: T) {
    return this.transformToDbObject(item);
  }

  protected getFinalCollection(): AngularFirestoreCollection<T> {
    return this.getItemCollection(this.prevParams);
  }

  protected abstract getItemCollection(params: string[]): AngularFirestoreCollection<T>;

  protected transformToDbObject(item: T): any {
    return item;
  }

  protected transformCollection(items: Array<T>): Array<T> {
    return items;
  }

  protected transformToItem(dbObject: any, id: string): T {
    return dbObject as T;
  }

  protected transformFirestoreCollection(collection: AngularFirestoreCollection<T>): Observable<Array<T>> {
    return collection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        return this.transformToItem(a.payload.doc.data(), a.payload.doc.id);
      });
    }));
  }

  protected isChanged(params: string[]): boolean {
    return !this.prevParams || this.prevParams.length !== params.length || !params.every((param, idx) => {
      return param === this.prevParams[idx];
    });
  }
}
