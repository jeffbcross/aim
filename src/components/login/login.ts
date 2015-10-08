///<reference path="../../../typings/tsd.d.ts"/>
import {Component, ElementRef, View, Query, QueryList} from 'angular2/angular2';

@Component({
  selector: 'login'
})
@View({
  template: '<button #loginbtn (click)="login()">login</button>'
})
export class LoginCmp {
  loginBtn:ElementRef;
  constructor(@Query('loginbtn') loginBtn:QueryList<ElementRef>) {;
    console.log('btn', loginBtn);
  }
  login() {

  }
}