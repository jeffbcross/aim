///<reference path="../typings/tsd.d.ts"/>
import {bootstrap, Component, View} from 'angular2/angular2';
import {Http} from 'angular2/http';

@Component({
  selector: 'aim-app'
})
@View({
  template: 'hello'
})
class AimApp {

}

bootstrap(AimApp);
