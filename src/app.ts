declare var require:(s:string)=>any;

require('reflect-metadata');
import 'zone.js';
import {
  bootstrap,
  provide,
  Component,
  View
} from 'angular2/angular2';
import * as Firebase from 'firebase';
import {LoginCmp} from './components/login/login';
import {FIREBASE_URL, FirebaseRef} from './config';
import {AuthService} from './services/auth-service/auth-service';

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
  constructor() {

  }
}

bootstrap(AimApp, [
  provide(FirebaseRef, {useValue: new Firebase(FIREBASE_URL)}),
  provide(AuthService, {useClass: AuthService})
]);
