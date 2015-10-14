declare var require:(s:string)=>any;

require('reflect-metadata');
import 'zone.js';
import {bind, bootstrap, Component, View} from 'angular2/angular2';
import {LoginCmp} from './components/login/login';

// Not used yet
var styles = require("!css!sass!./app.scss");

@Component({
  selector: 'aim-app'
})
@View({
  template: `
    <login></login>
  `,
  directives: [LoginCmp]
})
class AimApp {

}

bootstrap(AimApp, []);
