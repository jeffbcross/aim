import {Component, Control, EventEmitter, FORM_DIRECTIVES, NgControl, NgFor, NgIf, ChangeDetectionStrategy, Output} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import {Observable, Subject} from '@reactivex/rxjs';
import {RxPipe} from '../../services/rx-pipe/rx-pipe';
import {TickerLoader} from '../../services/ticker_loader/ticker_loader';

@Component({
  selector: 'typeahead',
  template: `
    <div class="input-group">
      <span class="input-group-addon" id="symbol-input">NYSE</span>
      <input
        type="text"
        class="form-control"
        placeholder="Search for Symbol..."
        #symbol [ng-form-control]="searchText" aria-describedby="symbol-input">
    </div>
    <table class="table table-striped">
      <tbody>
        <tr *ng-for="#tick of tickers | rx" class="typeahead-choice" (click)="onSelect(tick)">
          <td>{{tick.symbol}}</td>
          <td>{{tick.company_name}}</td>
        </tr>
      </tbody>
    </table>
  `,
  directives: [FORM_DIRECTIVES, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [RxPipe],
  providers: [TickerLoader]
})
export class TypeAhead {
  @Output('selected') selected = new EventEmitter();

  searchText = new Control();

  tickers: Observable<any[]>;

  constructor(http:Http, tickerLoader:TickerLoader) {
    // get a stream of changes from the tickers input
    this.tickers = Observable.from((<EventEmitter>this.searchText.valueChanges).toRx())
      // wait for a pause in typing of 200ms then emit the last value
      .debounceTime(200)
      // only accept values that don't repeat themselves
      .distinctUntilChanged()
      // map that to an observable HTTP request, using the TickerLoad
      // service and switch to that
      // observable. That means unsubscribing from any previous HTTP request
      // (cancelling it), and subscribing to the newly returned on here.
      .switchMap((val:string) => tickerLoader.load(val))
  }

  onSelect(ticker){
    this.selected.next(ticker);
    this.searchText.updateValue('');
  }
}
