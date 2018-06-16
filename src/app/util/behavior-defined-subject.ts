/**
 * @class BehaviorDefinedSubject<T>
 */
import {ObjectUnsubscribedError, Subject, Subscriber, Subscription, SubscriptionLike} from 'rxjs';

export class BehaviorDefinedSubject<T> extends Subject<T> {
  private _value: T = undefined;

  constructor() {
    super();
  }

  get value(): T {
    return this.getValue();
  }

  /** @deprecated This is an internal implementation detail, do not use. */
  _subscribe(subscriber: Subscriber<T>): Subscription {
    const subscription = super._subscribe(subscriber);
    if (subscription && !(<SubscriptionLike>subscription).closed && this._value !== undefined) {
      subscriber.next(this._value);
    }
    return subscription;
  }

  getValue(): T {
    if (this.hasError) {
      throw this.thrownError;
    } else if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return this._value;
    }
  }

  next(value: T): void {
    super.next(this._value = value);
  }
}
