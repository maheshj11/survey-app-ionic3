import { Deeplinks } from '@ionic-native/deeplinks';
import { AuthService } from '../providers/auth/auth.service';
import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { AlertController, App, Nav, NavController, Platform, Loading, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as moment from 'moment-timezone';
declare var FCMPlugin;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: string = 'TabsPage';
  requiredString: string;
  surveyId: string;
  parentId: string
  confirmAlert: any;
  showedAlert: boolean;
  incomingNotification: boolean = false;
  data: any;
  loader: Loading

  @ViewChild(Nav) navChild: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private authService: AuthService,
    private deeplinks: Deeplinks,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private app: App) {

    this.authService.getAuthenticatedUser().subscribe(auth => {
      if (auth) {
        if (this.incomingNotification) {
          this.navChild.push('SurveyStatsPage', { userId: this.data.fromId, surveyId: this.data.fromKey });
        }
        else {
          const userId = localStorage.getItem('userId')
          const surveyId = localStorage.getItem('surveyId')
          if (userId) {
            this.navChild.push('SubmitVotePage', { surveyId: surveyId, userId: userId })
          }
          else {
            this.rootPage = 'TabsPage';
          }
        }
      }
      else {
        this.rootPage = "LoginPage"
      }
    })

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();
      moment.tz.setDefault("Asia/Kolkata");

      /* AdMob Ads */
      // if (platform.is('cordova')) {
      //   const bannerConfig: AdMobFreeBannerConfig = {
      //     // add your config here
      //     // for the sake of this example we will just use the test config
      //     id:'ca-app-pub-2929781564932795/8340248664',
      //     isTesting: false,
      //     autoShow: true
      //   };
      //   this.admobFree.banner.config(bannerConfig);

      //   this.admobFree.banner.prepare()
      //     .then(() => {
      //       // banner Ad is ready
      //       // if we set autoShow to false, then we will need to call the show method here
      //     })
      //     .catch(e => console.log(e));
      // }


      /* Push Notification */
      if (typeof FCMPlugin != 'undefined') {
        let $this = this
        FCMPlugin.onNotification(function (data) {
          if (data.wasTapped) {
            $this.incomingNotification = true;
            $this.data = data;
          } else {
            $this.data = data;
            const alert = $this.alertCtrl.create({
              title: "Recieved a VOTE",
              message: "Would you like to go to stats page to see the voted details?",
              buttons: [
                {
                  text: 'No',
                  role: 'Cancel',
                  handler: () => { }
                },
                {
                  text: 'YES',
                  handler: () => {
                    $this.navChild.push('SurveyStatsPage', { userId: $this.data.fromId, surveyId: $this.data.fromKey })
                  }
                }
              ]
            });
            alert.present();
          }
        });
      }




      /* Mobile Hardware Back Button Function */

      platform.registerBackButtonAction(() => {
        let activeNav = this.app.getActiveNavs()
        activeNav.map((view: any) => {
          if (view.root === 'ProfilePage' || view.root === 'VotePage') {
            this.navChild.setRoot("TabsPage");
          }
          else {
            this.navChild.getActive().name;
            console.log(this.navChild.getActive().name);
            if (this.navChild.getActive().name === "SubmitVotePage" || this.navChild.getActive().name === "SurveyStatsPage") {
              this.navChild.setRoot("TabsPage");
            }
            else {
              if (view.canGoBack()) {
                view.pop();
              }
              else {
                if (!this.showedAlert) {
                  this.showedAlert = true;
                  this.confirmAlert = this.alertCtrl.create({
                    title: "Exit App",
                    message: "Do you want to exit the app?",
                    buttons: [
                      {
                        text: 'NO',
                        handler: () => {
                          this.showedAlert = false;
                          return;
                        }
                      },
                      {
                        text: 'YES',
                        handler: () => {
                          platform.exitApp();
                        }
                      }
                    ]
                  });
                  this.confirmAlert.present();
                } else {
                  this.showedAlert = false;
                  this.confirmAlert.dismiss();
                }
              }
            }
          }
        })
      })

      /* Mobile DeepLinking Function */

      this.deeplinks.routeWithNavController(this.navChild, {
        '/vote/:userId/:surveyId': 'SubmitVotePage'
      }).subscribe((match) => {
        console.log('Successfully routed', match);
      }, (nomatch) => {
        console.warn('Unmatched Route', nomatch);
      });
    });
  }
}

