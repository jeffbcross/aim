/**
 * This implementation of RxPipe is copied from Angular 2's Async pipe, which doesn't
 * yet support RxJS Observables. This is just a side-effect of transitioning Angular
 * 2 to using the new RxJS library, and will go away shortly, making this pipe
 * obsolete.
 */

import {
  AsyncPipe,
  ChangeDetectorRef,
  Injectable,
  Pipe,
  PipeOnDestroy,
  PipeTransform,
  WrappedValue
} from 'angular2/angular2';
import {Observable} from '@reactivex/rxjs';

class ObservableStrategy {
  createSubscription(async: Observable<any>, updateLatestValue: any): any {
    return async.subscribe(updateLatestValue, e => { throw e; });
  }

  dispose(subscription: any): void { subscription.unsubscribe(); }

  onDestroy(subscription: any): void { subscription; }
}

var _observableStrategy = new ObservableStrategy();


/**
 * The `async` pipe subscribes to an Observable or Promise and returns the latest value it has
 * emitted.
 * When a new value is emitted, the `async` pipe marks the component to be checked for changes.
 *
 * # Example
 * The example below binds the `time` Observable to the view. Every 500ms, the `time` Observable
 * updates the view with the current time.
 *
 * ```
 * import {Observable} from 'angular2/core';
 * @Component({
 *   selector: "task-cmp",
 *   template: "Time: {{ time | async }}"
 * })
 * class Task {
 *   time = new Observable<number>(observer => {
 *     setInterval(_ =>
 *       observer.next(new Date().getTime()), 500);
 *   });
 * }
 * ```
 */
@Injectable()
@Pipe({
  name: 'rx',
  pure: false
})
export class RxPipe implements PipeTransform, PipeOnDestroy {
  /** @internal */
  _latestValue: Object = null;
  /** @internal */
  _latestReturnedValue: Object = null;

  /** @internal */
  _subscription: Object = null;
  /** @internal */
  _obj: Observable<any>;
  private _strategy: any = null;
  /** @internal */
  public _ref: ChangeDetectorRef;
  constructor(_ref: ChangeDetectorRef) { this._ref = _ref; }

  onDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
  }

  transform(obj: Observable<any>, args?: any[]): any {
    if (!this._obj) {
      if (obj) {
        this._subscribe(obj);
      }
      return null;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj);
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    } else {
      this._latestReturnedValue = this._latestValue;
      return WrappedValue.wrap(this._latestValue);
    }
  }

  /** @internal */
  _subscribe(obj: Observable<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription =
        this._strategy.createSubscription(obj, value => this._updateLatestValue(obj, value));
  }

  /** @internal */
  _selectStrategy(obj: Observable<any>): any {
    if (typeof obj.subscribe === 'function') {
      return _observableStrategy;
    } else {
      throw new Error('invalid input to rx pipe');
    }
  }

  /** @internal */
  _dispose(): void {
    this._strategy.dispose(this._subscription);
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  /** @internal */
  _updateLatestValue(async: any, value: Object) {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.markForCheck();
    }
  }
}
