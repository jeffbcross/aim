import {Component, Control, EventEmitter, ControlGroup, FORM_DIRECTIVES, NgControl, NgFor, ChangeDetectionStrategy, Output} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import {Observable, Subject} from '@reactivex/rxjs';
import {RxPipe} from '../../services/rx-pipe/rx-pipe';

@Component({
  selector: 'typeahead',
  template: `
    (Start by typing Go, then type Goo. URLs are hard-coded to go.json and goo.json, so other queries won't work)
    <form [ng-form-model]="form">
      <input #symbol ng-control="ticker" type="text" placeholder="ticker symbol">
    </form>
    <ul>
      <li *ng-for="#ticker of tickers | rx">{{ticker.symbol}} ({{ticker.company_name}}
        <button (click)="onSelect(ticker)">Toogl</button>
      </li>
    </ul>
  `,
  directives: [FORM_DIRECTIVES, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [RxPipe]
})
export class TypeAhead {
  @Output('selected') selected = new EventEmitter();
  clear = new Subject();
  ticker = new Control();
  
  tickers: Observable<any[]>;
  form:ControlGroup = new ControlGroup({
    ticker: this.ticker
  });
  constructor(http:Http) {
    this.tickers = Observable.from((<EventEmitter>this.ticker.valueChanges).toRx())
      .debounceTime(200)
      .switchMap(val => {
        console.log('val', val);
        return http.request(`http://localhost:3000/stocks?symbol=${val}`)
      }, (val:string, res:Response) => res.json())
      .merge(this.clear.mapTo([]));
  }
  onSelect(ticker){
    this.selected.next(ticker);
    this.clear.next('');
  }
}
