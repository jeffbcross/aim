///<reference path="../../../typings/tsd.d.ts"/>
import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Output,
  View,
  ViewChild,
  Query,
  QueryList
} from 'angular2/angular2';
import {Observable, Subscription} from '@reactivex/rxjs';

@Component({
  selector: 'login'
})
@View({
  template: `<input #loginbtn (click)="login()" placeholder="login?">`
})
export class LoginCmp implements AfterViewInit {
  @ViewChild('loginbtn') loginBtn:ElementRef;
  @Output() success = new EventEmitter();
  @Output() failure = new EventEmitter();
  loginObservable:Subscription<any>;

  afterViewInit () {
    Observable.fromEvent(this.loginBtn.nativeElement, 'click', () => {});
  }

  login() {
    console.log('logging in?');
  }
}
