import {BehaviorSubject, Observable} from 'rxjs';

export class SpinnerService {

  constructor() {
  }
  private showHideSubscription = new BehaviorSubject<boolean>(false);

  show() {
    this.showHideSubscription.next(true);
  }

  hide() {
    this.showHideSubscription.next(false);
  }

  getShowHideSubscription(): Observable<boolean> {
    return this.showHideSubscription.asObservable();
  }
}
