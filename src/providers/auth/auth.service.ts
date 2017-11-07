import { Account } from './../../models/account/account.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  constructor(public auth: AngularFireAuth) {
  }

  getAuthenticatedUser() {
    return this.auth.authState;
  }
  signInWithFb(cred) {
    return this.auth.auth.signInWithCredential(cred);
  }
  signInWithGoogle() {
    
  }
  createUserWithEmailPassword(account: Account) {
    return this.auth.auth.createUserWithEmailAndPassword(account.email, account.password);
  }
  signInWithEmailPassword(account: Account) {
    return this.auth.auth.signInWithEmailAndPassword(account.email, account.password);
  }
  signOut() {
    return this.auth.auth.signOut();
  }
  updatePassword(authenticatedUser,newPassword) {
    authenticatedUser.updatePassword(newPassword)
    .then(function () {
      console.log('Updated Successfully');
    }).catch(function (error) {
      console.log(error);
    });
  }
}
