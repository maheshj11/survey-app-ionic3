import { ToastController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from './../../providers/auth/auth.service';
import { Account } from './../../models/account/account.interface';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@IonicPage({
  segment: 'register'
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  account = {} as Account;
  loader: Loading;
  privacyCheckbox: boolean = false;
  isChecked: boolean = false;

  constructor(private auth: AuthService,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
    this.account.email = this.navParams.get('email');
    this.loader = this.loadingCtrl.create({
      content: 'Registering You!!!'
    })
  }


  register() {
    this.loader.present();
    this.auth.createUserWithEmailPassword(this.account)
      .then(data => {
        this.loader.dismiss();
        const Toast = this.toastCtrl.create({
          duration: 2000,
          message: "Account Created Successfully"
        })
        Toast.present();
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
