declare var require:(s:string)=>any;

require('reflect-metadata');
import 'zone.js';
import {
  bootstrap,
  provide,
  Component,
  FORM_BINDINGS,
  CORE_DIRECTIVES,
  View
} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';
import {TypeAhead} from './components/typeahead/typeahead';
import {TickerService} from './services/TickerService';
import {RxPipe} from './services/rx-pipe/rx-pipe';

// Not used yet
var styles = require("!css!sass!./app.scss");

var tickerService = new TickerService('ws://localhost:8081');

@Component({
  selector: 'aim-app'
})
@View({
  template: `
    <h1>Angular Investment Manager</h1>
    <h2>Status: {{tickerService.connectionState | rx}}</h2>
    <typeahead (selected)="onSelect($event)"></typeahead>
    <li *ng-for="#ticker of tickers">
      {{ (ticker.ticker | rx)?.price }}
      <button (click)="removeTicker(ticker.symbol)"> x </button>
    
    </li>
  `,
  directives: [TypeAhead, CORE_DIRECTIVES],
  pipes: [RxPipe]
})
class AimApp {
  tickers = [];
  tickerService = tickerService;
  constructor() {
    //tickerService.getTicker('acg').subscribe(val => console.log('ticker update', val));
  }
  onSelect({symbol}){
    const tickers = this.tickers;
    if(tickers.find(x => x.symbol === symbol)) {
      return;
    }
    tickers.push({ symbol, ticker: tickerService.getTicker(symbol) });
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
  HTTP_BINDINGS
]);
