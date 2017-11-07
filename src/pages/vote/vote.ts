import { DataService } from './../../providers/data/data.service';
import { User } from 'firebase/app';
import { AuthService } from './../../providers/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';

@IonicPage({
  segment: 'vote'
})
@Component({
  selector: 'page-vote',
  templateUrl: 'vote.html',
})
export class VotePage implements OnInit {
  private authenticatedUser: User;
  surveyList: any[];
  loader: Loading;
  emptyList: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private dataService: DataService) {
    this.authService.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user;
    })
    this.loader = this.loadingCtrl.create({
      content: 'Loading Surveys'
    })
  }

  ngOnInit() {
    this.loader.present();
    this.dataService.getRecievedSurveys(this.authenticatedUser).subscribe(data => {
      if(data.length === 0){
        this.emptyList = true;
      }
      this.surveyList = data;
      this.loader.dismiss();
    });
  }

  goToSubmitVotePage(survey) {
    this.navCtrl.push('SubmitVotePage', { surveyKey: survey.$key, commentsSurveyKey: survey.commentsSurveyKey, surveyId: survey.fromKey, userId: survey.fromId })
  }

}
