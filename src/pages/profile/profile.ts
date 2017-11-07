import { Account } from './../../models/account/account.interface';
import { Profile } from './../../models/profile/profile.interface';
import { User } from 'firebase/app';
import { App, ToastController, Loading, LoadingController } from 'ionic-angular';
import { DataService } from './../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  segment: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  private authenticatedUser: User;
  profile = {} as Profile;
  updateProfile: boolean = false;
  account = {} as Account;
  loader: Loading;
  socialLogin:boolean = false;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private authService: AuthService,
    private dataService: DataService,
    private appCtrl: App,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
      this.loader = this.loadingCtrl.create({
        content: 'Loading Profile!!!'
      })
  }

  ngOnInit() {
    this.loader.present();
    this.authService.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user;
      if(this.authenticatedUser.displayName){debugger
        this.socialLogin = true;
      }
      this.dataService.getProfile(this.authenticatedUser).subscribe(result => {
        this.loader.dismiss();
        if (result.firstName) {
          this.updateProfile = true;
          this.profile = result;
        }
        else {
          if(this.authenticatedUser.displayName){
            let name = this.authenticatedUser.displayName
            let arrName = name.split(" ");
            let firstName = arrName.slice(0, 1).join(' ');
            let lastName = arrName.slice(1, arrName.length).join(' ');
            const profileData = {} as Profile;
            profileData.firstName = firstName
            profileData.lastName = lastName
            this.dataService.saveProfile(this.authenticatedUser, profileData);
          }
        }
      })
    })
  }

  saveProfile() {
    if (this.authenticatedUser) {
      const profileData = {} as Profile;
      profileData.firstName = this.profile.firstName || null;
      profileData.lastName = this.profile.lastName || null;
      profileData.dateOfBirth = this.profile.dateOfBirth || null;
      this.dataService.saveProfile(this.authenticatedUser, profileData);
    }
    this.navCtrl.push('TabsPage');
  }

  changePass() {
    this.navCtrl.push('ChangePasswordPage');
  }

  signOut() {
    this.loader = this.loadingCtrl.create({
      content: 'Loggin You Out!!!'
    })
    this.loader.present();
    this.authService.signOut();
    this.appCtrl.getRootNav().setRoot('LoginPage')
    .then(data => {
      this.loader.dismiss();
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
