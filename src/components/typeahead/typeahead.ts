import {Component, Control, EventEmitter, ControlGroup, FORM_DIRECTIVES, NgControl, NgFor} from 'angular2/angular2';
import {Http} from 'angular2/http';
import {Observable} from '@reactivex/rxjs';

@Component({
  selector: 'typeahead',
  template: `
    (Start by typing Go, then type Goo. URLs are hard-coded to go.json and goo.json, so other queries won't work)
    <form [ng-form-model]="form">
      <input #symbol ng-control="ticker" type="text" placeholder="ticker symbol">
    </form>
    <ul>
      <li *ng-for="#ticker of tickers">{{ticker}}</li>
    </ul>
  `,
  directives: [FORM_DIRECTIVES, NgFor]
})
export class TypeAhead {
  ticker = new Control();
  tickers: string[];
  form:ControlGroup = new ControlGroup({
    ticker: this.ticker
  });
  constructor(http:Http) {
    Observable.from((<EventEmitter>this.ticker.valueChanges).toRx())
      .debounceTime(200)
      .map(val => {
        return `${val}.json`
      })
      .switchMap(url => http.request(url))
      .map(res => res.json())
      .map(tickers => tickers.data)
      .subscribe(value => {
        this.tickers = value;
      });
  }
}
