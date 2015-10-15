/// <reference path="../../../typings/tsd.d.ts"/>
import {Inject, Injectable} from 'angular2/angular2';
import {ReplaySubject} from '@reactivex/rxjs';
import * as Firebase from 'firebase';

import {FirebaseRef, FIREBASE_URL} from '../../config';

@Injectable()
export class AuthService {
  auth:ReplaySubject<FirebaseAuthData> = new ReplaySubject(1);
  constructor(@Inject(FirebaseRef) private _fbRef:Firebase) {
    this.auth.next(this._fbRef.getAuth());
  }

  login() {
    console.log('login in service');
    this._fbRef.authWithOAuthPopup('github', (err, authData) => {
      if (err) return this.auth.error(err);
      this.auth.next(authData);
    });
  }

  logout() {
    this._fbRef.unauth();
    this.auth.next(null);
  }
}
