///<reference path="../typings/tsd.d.ts"/>
declare var require:(s:string)=>any;

require('reflect-metadata/Reflect');
import {bind, bootstrap, Component, View} from 'angular2/angular2';
import {LoginCmp} from './components/login/login';

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
