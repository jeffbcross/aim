import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  NgIf,
  Output,
  View,
  ViewChild,
  Query,
  QueryList
} from 'angular2/angular2';
import {Observable, Subscription} from '@reactivex/rxjs';
import {AuthService} from '../../services/auth-service/auth-service';
import {RxPipe} from '../../services/rx-pipe/rx-pipe';

@Component({
  selector: 'login'
})
@View({
  template: `
    auth value: {{_authService.auth | rx | json}}
    <button *ng-if="!(_authService.auth | rx)" #loginbtn (click)="login()">
      login
    </button>
    <button *ng-if="(_authService.auth | rx)" #logoutbtn (click)="logout()">
      logout
    </button>
  `,
  directives: [NgIf],
  pipes: [RxPipe]
})
export class LoginCmp implements AfterViewInit {
  @ViewChild('loginbtn') loginBtn:ElementRef;
  @Output() success = new EventEmitter();
  @Output() failure = new EventEmitter();
  loginObservable:Subscription<any>;

  constructor(private _authService:AuthService) {

  }

  afterViewInit () {
    Observable.fromEvent(this.loginBtn.nativeElement, 'click', () => {});
  }

  login() {
    console.log('logging in?');
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }
}
