import { User } from 'firebase/app';
import { AuthService } from './../../providers/auth/auth.service';
import { DataService } from './../../providers/data/data.service';
import { Component } from '@angular/core';
import { Account } from './../../models/account/account.interface';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  private authenticatedUser: User;
  newPassword: string;
  account = {} as Account;
  loader: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
    this.authService.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user;
    })
  }
  ionViewDidLoad() {
    this.createLoader();
  }

  createLoader() {
    this.loader = this.loadingCtrl.create({
      content: 'Changing Your Password!!!'
    })
  }

  updatePassword() {
    this.createLoader();
    this.loader.present()
    let $this= this
    this.account.email = this.authenticatedUser.email;
    this.authService.signInWithEmailPassword(this.account)
      .then(data => {
        this.authenticatedUser.updatePassword(this.account.newPassword).then(function () {
         $this.loader.dismiss();
         $this.navCtrl.pop()
          const Toast = $this.toastCtrl.create({
            duration: 2000,
            message: 'Password updated successfully'
          })
          Toast.present()
        }).catch(error => {
          $this.loader.dismiss();
          const Toast = $this.toastCtrl.create({
            duration: 2000,
            message: error.message
          })
          Toast.present()
        })
      })
      .catch(error => {
        $this.loader.dismiss();
        const Toast = $this.toastCtrl.create({
          duration: 2000,
          message: error.message
        })
        Toast.present()
      })
  }

}
