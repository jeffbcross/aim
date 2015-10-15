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
      <button (click)="removeTicker(ticker.symbol)"> x </button>
      {{ticker.symbol}}: {{(ticker.prices | rx)}}
      <div>{{ (ticker.recentTicks | rx) }}</div>
    </li>
  `,
  directives: [TypeAhead, CORE_DIRECTIVES],
  pipes: [RxPipe]
})
class AimApp {
  tickers: Ticker[] = [];

  tickerService = tickerService;

  constructor() {
    //tickerService.getTicker('acg').subscribe(val => console.log('ticker update', val));
  }

  onSelect({symbol}){
    const tickers = this.tickers;
    if(tickers.find(x => x.symbol === symbol)) {
      return;
    }

    const ticks = tickerService.getTicker(symbol);
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

class Ticker {
  constructor(public symbol: string, public ticks: Observable<number>) {

  }

  get prices() {
    return this.ticks.map(x => x.price.toFixed(2)).do(console.log.bind(console));
  }

  get recentTicks() {
    return this.ticks.scan((acc, tick) => {
      const result = acc.concat([tick]);
      while(result.length > 40) {
        result.shift();
      }
      return result;
    }, []);
  }
}

bootstrap(AimApp, [
  FORM_BINDINGS,
  HTTP_BINDINGS
]);
