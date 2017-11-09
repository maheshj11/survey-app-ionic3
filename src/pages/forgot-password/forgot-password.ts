import { Account } from '../../models/account/account.interface';
import { AuthService } from './../../providers/auth/auth.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Loading } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  account = {} as Account;
  loader: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private auth:AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  sendResetEmail(){
    this.createLoader();
    const $this = this;
    this.loader.present()
    this.auth.sendResetEmail(this.account.email).then(data =>{
      this.loader.dismiss();
      const Toast = this.toastCtrl.create({
        duration: 2000,
        message: 'Password Reset Email sent successfully'
      })
      Toast.present();
      this.navCtrl.pop();
    }).catch(function(error) {
      $this.loader.dismiss();
      const Toast = $this.toastCtrl.create({
        duration: 2000,
        message: error.message
      })
      Toast.present()
    });
  }
  createLoader() {
    this.loader = this.loadingCtrl.create({
      content: 'Please Wait'
    })
  }
}
