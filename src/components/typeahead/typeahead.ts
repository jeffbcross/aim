import {Component, Control, EventEmitter, FORM_DIRECTIVES, NgControl, NgFor, ChangeDetectionStrategy, Output} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import {Observable, Subject} from '@reactivex/rxjs';
import {RxPipe} from '../../services/rx-pipe/rx-pipe';

@Component({
  selector: 'typeahead',
  template: `
    <input #symbol [ng-form-control]="ticker" type="text" placeholder="ticker symbol">
    <ul>
      <li *ng-for="#tick of tickers | rx">{{tick.symbol}} ({{tick.company_name}}
        <button type="button" (click)="onSelect(tick)">Toogl</button>
      </li>
    </ul>
  `,
  directives: [FORM_DIRECTIVES, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [RxPipe]
})
export class TypeAhead {
  @Output('selected') selected = new EventEmitter();
  clear = new EventEmitter();

  ticker = new Control();

  tickers: Observable<any[]>;

  constructor(http:Http) {
    // get a stream of changes from the tickers input
    this.tickers = Observable.from((<EventEmitter>this.ticker.valueChanges).toRx())
      // wait for a pause in typing of 200ms then emit the last value
      .debounceTime(200)
      // only accept values that don't repeat themselves
      .distinctUntilChanged()
      // map that to an observable HTTP request and switch to that
      // observable. That means unsubscribing from any previous HTTP request
      // (cancelling it), and subscribing to the newly returned on here.
      .switchMap(val => {
        return http.request(`http://localhost:3000/stocks?symbol=${val}`)
      }, (val:string, res:Response) => res.json())
      // send an empty array to tickers whenever clear emits by
      // merging in a the stream of clear events mapped to an
      // empty array.
      .merge(this.clear.toRx().mapTo([]));
  }

  onSelect(ticker){
    this.selected.next(ticker);
    this.clear.next('');
  }
}
