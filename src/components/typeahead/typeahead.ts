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
    this.tickers = Observable.from((<EventEmitter>this.ticker.valueChanges).toRx())
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(val => {
        return http.request(`http://localhost:3000/stocks?symbol=${val}`)
      }, (val:string, res:Response) => res.json())
      .merge(this.clear.toRx().mapTo([]));
  }
  onSelect(ticker){
    this.selected.next(ticker);
    this.clear.next('');
  }
}
