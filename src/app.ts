///<reference path="../typings/tsd.d.ts"/>
import {bind, bootstrap, Component, View} from 'angular2/angular2';
import {Http} from 'angular2/http';
import {APP_BASE_HREF, RouteConfig, ROUTER_DIRECTIVES, ROUTER_BINDINGS, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {LoginCmp} from './components/login/login';

@Component({
  selector: 'aim-app'
})
@View({
  template: `<a [router-link]="['./LoginCmp']">login</a><router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path:'/login', component: LoginCmp, as: 'LoginCmp'}
])
class AimApp {

}

bootstrap(AimApp, [
    ROUTER_BINDINGS,
    bind(APP_BASE_HREF).toValue('/'),
    bind(ROUTER_PRIMARY_COMPONENT).toValue(AimApp)
]);
