declare var require:(s:string)=>any;

require('reflect-metadata');
import 'zone.js';
import {
  bootstrap,
  provide,
  Component,
  FORM_BINDINGS,
  View
} from 'angular2/angular2';
import {HTTP_BINDINGS} from 'angular2/http';
import {TypeAhead} from './components/typeahead/typeahead';
import {TickerService} from './services/TickerService';

// Not used yet
var styles = require("!css!sass!./app.scss");

var tickerService = new TickerService('ws://localhost:8081');

@Component({
  selector: 'aim-app'
})
@View({
  template: `
    <h1>Angular Investment Manager</h1>
    <typeahead></typeahead>
  `,
  directives: [TypeAhead]
})
class AimApp {
  constructor() {
    tickerService.getTicker('acg').subscribe(val => console.log('ticker update', val));
  }
}

bootstrap(AimApp, [
  FORM_BINDINGS,
  HTTP_BINDINGS
]);
