///<reference path="../typings/tsd.d.ts"/>
declare var require:(s:string)=>any;

import {bind, bootstrap, Component, View} from 'angular2/angular2';
import {LoginCmp} from './components/login/login';

var styles = require("!css!sass!./app.scss");

console.log('styles', styles);

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
