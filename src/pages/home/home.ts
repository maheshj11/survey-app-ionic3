import { Survey } from '../../models/survey/survey.interface';
import { DataService } from './../../providers/data/data.service';
import { User } from 'firebase/app';
import { AuthService } from './../../providers/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, IonicPage, ItemSliding, NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
declare var FCMPlugin;

@IonicPage({
  segment: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private authenticatedUser: User;
  surveyList: Survey[]
  loader: Loading;
  showedAlert: boolean;
  confirmAlert: any;
  emptyList: boolean;
  loaderPresent= false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private dataService: DataService,
    private socialSharing: SocialSharing,
    private alertCtrl: AlertController) {
    this.authService.getAuthenticatedUser().subscribe((user: User) => {
      if (user) {
        if(!this.loaderPresent){
          this.loaderstart();
          this.loader.present();
          this.loaderPresent = true;
        }
        this.authenticatedUser = user;
        if (this.authenticatedUser) {
          this.dataService.getSurveys(this.authenticatedUser).subscribe((data: Survey[]) => {
            if (data.length === 0) {
              this.emptyList = true;
            }
            this.surveyList = data;
            //this.surveyList = Object.assign([],data);
            console.log(data);
            this.loader.dismiss();
          });

          let $this = this;
          if (typeof FCMPlugin != 'undefined') {
            this.tokenSetup().then((token) => {
              const tokenData = {
                uid: $this.authenticatedUser.uid,
                deviceToken: token
              };
              console.log(tokenData);
              this.dataService.storeToken(tokenData, this.authenticatedUser.uid);
            })
          }
        }
      }
      else {
        this.navCtrl.setRoot("LoginPage")
      }
    })
  }

  // ionViewWillEnter(){
  //   this.loaderstart()
  // }
  loaderstart() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait'
    })
  }

  tokenSetup() {
    var promise = new Promise((resolve, reject) => {
      FCMPlugin.getToken(function (token) {
        resolve(token);
      }, (err) => {
        reject(err);
      });
    })
    return promise;
  }

  addNewSurvey() {
    this.navCtrl.push('AddSurveyPage');
  }

  surveyStats(item: ItemSliding, survey) {
    this.navCtrl.push('SurveyStatsPage', { userId: this.authenticatedUser.uid, surveyId: survey.$key });
    item.close();
  }

  removeSurvey(item: ItemSliding, survey) {
    const alert = this.alertCtrl.create({
      title: "Delete Survey",
      message: "Would you like to delete the survey?",
      buttons: [
        {
          text: 'No',
          role: 'Cancel',
          handler: () => { }
        },
        {
          text: 'YES',
          handler: () => {
            this.dataService.deleteSurvey(this.authenticatedUser, survey);
          }
        }
      ]
    });
    alert.present();
    item.close();
  }

  editSurvey(survey) {
    this.navCtrl.push('EditSurveyPage', { survey: survey });
  }

  enableSurvey(item: ItemSliding, clickedSurvey) {
    const survey = clickedSurvey;
    const alert = this.alertCtrl.create({
      title: "Enable Survey",
      message: "Would you like to start recieving votes for this survey?",
      buttons: [
        {
          text: 'No',
          role: 'Cancel',
          handler: () => { }
        },
        {
          text: 'YES',
          handler: () => {
            survey.disabled = false;
            this.dataService.updateSurvey(this.authenticatedUser.uid, survey, survey.$key);
          }
        }
      ]
    });
    alert.present();
    item.close();
  }
  disableSurvey(item: ItemSliding, clickedSurvey) {
    const survey = clickedSurvey;
    const alert = this.alertCtrl.create({
      title: "Disable Survey",
      message: "Would you like to stop recieving votes for this survey?",
      buttons: [
        {
          text: 'No',
          role: 'Cancel',
          handler: () => { }
        },
        {
          text: 'YES',
          handler: () => {
            survey.disabled = true;
            this.dataService.updateSurvey(this.authenticatedUser.uid, survey, survey.$key);
          }
        }
      ]
    });
    alert.present();
    item.close();
  }
  shareSurvey(item: ItemSliding, survey) {
    this.socialSharing.share("You are invited to vote for survey", null, null, `https://surveyapp-e8b88.firebaseapp.com/vote/${this.authenticatedUser.uid}/${survey.$key}`)
    item.close();
  }
}
