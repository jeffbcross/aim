declare var require:(s:string)=>any;

require('reflect-metadata');
import 'zone.js';
import {
  bootstrap,
  provide,
  Component,
  View
} from 'angular2/angular2';

// Not used yet
var styles = require("!css!sass!./app.scss");

@Component({
  selector: 'aim-app'
})
@View({
  template: `
    <h1>Angular Investment Manager</h1>
  `,
  directives: []
})
class AimApp {
  constructor() {

  }
}

bootstrap(AimApp, [
]);
