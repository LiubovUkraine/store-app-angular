import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';

import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public fireUser: any;

  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  constructor(private firebaseAuth: AngularFireAuth, private _router: Router) {
    this.user = firebaseAuth.authState;

    this.user.subscribe((user) => {
      this.userDetails = user;
      console.log(this.userDetails); // I get a response from this on the login page with user details ( user is logged in )
    });
  }

  public signup(email: string, password: string): void {
    this.firebaseAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((value) => {
        console.log('Success!', value);
      })
      .catch((err) => {
        console.log('signup Something went wrong:', err.message);
      });
  }

  public login(email: string, password: string): void {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        console.log(value);
      })
      .catch((err) => {
        console.log('login Something went wrong:', err.message);
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      this._router.navigate(['/login']);
    });
  }
}
