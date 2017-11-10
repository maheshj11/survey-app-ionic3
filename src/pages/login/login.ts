import { AuthService } from './../../providers/auth/auth.service';
import { Account } from './../../models/account/account.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

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
  userId: string;
  surveyId: string;
  loader: Loading;
  showLoginWithEmail: boolean = false;
  privacyCheckbox: boolean = false;
  isChecked: boolean = false;

  constructor(private navCtrl: NavController,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: Facebook,
    private googlePlus: GooglePlus) {
    // this.loader = this.loadingCtrl.create({
    //   content: 'Please wait'
    // })
  }

  signInWithGoogle() {
    this.loaderstart();
    this.loader.present();
    this.googlePlus.login({
      'webClientId': '649597473188-nvasl6lsm189qg8k8ulldj3spe6dqvfc.apps.googleusercontent.com',
      'offline': true
    }).then((res) => {
      let credential = firebase.auth.GoogleAuthProvider.credential(res.idToken)
      this.auth.signInWithGoogle(credential).then(info => {
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
  goToRegisterPage() {
    this.navCtrl.push('RegisterPage', { email: this.account.email })
  }

  passReset() {
    this.navCtrl.push('ForgotPasswordPage');
  }
  loaderstart() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
  }

  signInWithFb() {
    this.loaderstart();
    this.loader.present();
    this.fb.login(['email'])
      .then((res: FacebookLoginResponse) => {
        let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
        this.auth.signInWithFb(credential).then(info => {
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

  login() {
    this.loaderstart();
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

  updateCheckbox() {
    if (this.privacyCheckbox === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
}
