declare var require:(s:string)=>any;
declare var d3:any;

require('reflect-metadata');
import 'zone.js';
import { Observable, BehaviorSubject } from '@reactivex/rxjs';
import {
  bootstrap,
  provide,
  Component,
  FORM_BINDINGS,
  CORE_DIRECTIVES,
  View,
  ViewEncapsulation
} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';
import {TypeAhead} from './components/typeahead/typeahead';
import {Navbar} from './components/navbar/nav';
import {ConnectionStates, TickerService, Ticker} from './services/TickerService';
import {StockGraph} from './components/graph/graph.ts';
import {RxPipe} from './services/rx-pipe/rx-pipe';
import {SOCKET_URL} from './config';
import {RxWebSocket} from './services/RxWebSocket';

// Not used yet
var styles = require("!css!sass!./app.css");

const statusLookup = [
  'WAITING FOR CONNECTION',
  'CONNECTED',
  'CLOSED',
  'RETRYING'
];

@Component({
  selector: 'aim-app'
})
@View({
  template: `
    <navbar [status]="connectionStatus | rx"></navbar>
    <div class="aim-app">
      <div class="container">
        <typeahead (selected)="onSelect($event)"></typeahead>
      </div>
      <div class="container">
        <div class="row" *ng-for="#ticker of tickers">
          <button (click)="removeTicker(ticker.symbol)" class="col-md-2 btn btn-default">Close</button>
          <h3 class="col-md-4">{{ticker.symbol}}</h3>
          <stock-graph [ticker]="ticker" class="col-md-8"></stock-graph>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  directives: [TypeAhead, StockGraph, Navbar, CORE_DIRECTIVES],
  pipes: [RxPipe]
})
class AimApp {
  tickers: Ticker[] = [];
  connectionStatus:Observable<string>;
  constructor(private _tickerService:TickerService) {
    // map our observable of connection states to
    // more readable status strings
    this.connectionStatus = this._tickerService.connectionState
      .map((state: number) => statusLookup[state])
  }

  onSelect({symbol}){
    const tickers = this.tickers;
    if(tickers.find(x => x.symbol === symbol)) {
      return;
    }

    const ticks = this._tickerService.getTicker(symbol);
    tickers.push(new Ticker(symbol, ticks));
  }

  removeTicker(symbol){
    const tickers = this.tickers;
    const index = tickers.findIndex(x => x.symbol === symbol);
    if(index !== -1) {
      tickers.splice(index, 1);
    }
  }
}

bootstrap(AimApp, [
  FORM_BINDINGS,
  HTTP_BINDINGS,
  TickerService,
  provide(SOCKET_URL, {useValue: SOCKET_URL}),
  provide(RxWebSocket, {useFactory: (url:string) => {
    return new RxWebSocket(url, WebSocket);
  }, deps: [SOCKET_URL]})
]);
