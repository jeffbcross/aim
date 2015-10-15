import {OpaqueToken} from 'angular2/angular2';

export const FIREBASE_URL = 'https://angular-instant.firebaseio.com/';
// Import using (@Inject(FirebaseRef) fbRef:Firebase)
export var FirebaseRef:OpaqueToken = new OpaqueToken('FirebaseRef');
