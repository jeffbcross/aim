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
import {TypeAhead} from './components/typeahead/typeahead';

// Not used yet
var styles = require("!css!sass!./app.scss");

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
  }
}

bootstrap(AimApp, [
  FORM_BINDINGS
]);
