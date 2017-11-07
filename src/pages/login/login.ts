import { AuthService } from './../../providers/auth/auth.service';
import { Account } from './../../models/account/account.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import * as firebase from 'firebase';
@IonicPage({
  segment: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  account = {} as Account;
  userId : string;
  surveyId : string;
  loader: Loading;
  showLoginWithEmail: boolean = false;

  constructor(private navCtrl: NavController,
              private auth: AuthService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private fb: Facebook) {
                this.loader = this.loadingCtrl.create({
                  content: 'Loggin You In!!!'
                })
  }


  goToRegisterPage() {
    this.navCtrl.push('RegisterPage')
  }

  showEmailLogin() {
    if (this.showLoginWithEmail == false) {
      this.showLoginWithEmail = true;
    }
    else {
      this.showLoginWithEmail = false;
    }
  }
  signInWithFb(){
    this.loader.present();
    this.fb.login(['email'])
    .then((res: FacebookLoginResponse) => {
      let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
      this.auth.signInWithFb(credential).then(info => {
        this.loader.dismiss();
        this.navCtrl.push('TabsPage');
      })
    })
    .catch(e => console.log('Error logging into Facebook', e));
  }
  signInWithGoogle() {
    this.auth.signInWithGoogle();
  }
  login() {
    this.loader.present();
    this.auth.signInWithEmailPassword(this.account)
    .then(data => {
      this.loader.dismiss();
      this.navCtrl.push('TabsPage');
    })
    .catch(error => {
      this.loader.dismiss();
      const Toast = this.toastCtrl.create({
        duration: 2000,
        message: error.message
      })
      Toast.present()
    })
  }
}
