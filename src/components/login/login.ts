///<reference path="../../../typings/tsd.d.ts"/>
import {AfterViewInit, Component, ContentChild, ElementRef, View, ViewChild, Query, QueryList} from 'angular2/angular2';

@Component({
  selector: 'login'
})
@View({
  template: `<input #loginbtn (click)="login()">`
})
export class LoginCmp implements AfterViewInit {
  @ViewChild('loginbtn') loginBtn:ElementRef;
  constructor() {;
    console.log('constructor');
  }

  afterViewInit () {
    console.log('btn', this.loginBtn);
  }

  login() {
    console.log('btn', this.loginBtn);
  }
}
