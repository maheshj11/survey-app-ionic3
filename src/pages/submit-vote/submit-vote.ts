import { Profile } from './../../models/profile/profile.interface';
import { Survey } from './../../models/survey/survey.interface';
import { RecievedSurvey } from '../../models/survey/recieved-survey.interface';
import { User } from 'firebase/app';
import { AuthService } from './../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavParams, Loading, LoadingController, ToastController, NavController } from 'ionic-angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import * as moment from 'moment';
import * as firebase from 'firebase';

@IonicPage({
  segment: 'vote/:userId/:surveyId',
  defaultHistory: ['TabsPage']
})
@Component({
  selector: 'page-submit-vote',
  templateUrl: 'submit-vote.html',
})
export class SubmitVotePage implements OnInit {

  surveyId: string;
  userId: string;
  surveyKey: string;
  commentsSurveyKey: string;
  votedItems = [];
  survey: Survey;
  private loader: Loading;
  authenticatedUser: User;
  typeSingle = false;
  typeMultiple = false;
  typeComments = false;
  inRecievedList = false;
  commentsVote: any;
  commentsArray = new Array();
  oldCommentsArray = new Array();
  profile = {} as Profile;
  votedData = [];
  empty = false;
  surveyTimeout = false;
  dateTime: moment.Moment;
  didVote: boolean = false;
  sameUser: boolean = false;
  surveyDisabled: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    private youtube: YoutubeVideoPlayer,
    private authService: AuthService,
    public _DomSanitizer: DomSanitizer,
    private toastCtrl: ToastController) {
      this.loader = this.loadingCtrl.create({
        content: 'Loading Survey'
      })
  }

  ngOnInit() {
    this.surveyId = this.navParams.get('surveyId');
    this.userId = this.navParams.get('userId');
    this.surveyKey = this.navParams.get('surveyKey');
    this.commentsSurveyKey = this.navParams.get('commentsSurveyKey')
    this.loader.present();
    this.authService.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user;
      if (this.authenticatedUser) {
        this.dataService.getProfile(this.authenticatedUser).subscribe((result:Profile) => {
          this.profile = result;
        })
        if (this.authenticatedUser.uid !== this.userId) {
          this.dataService.getRecievedSurveys(this.authenticatedUser).subscribe((data:RecievedSurvey[]) => {
            data.map(item => {
              if (item.fromKey === this.surveyId) {
                this.votedData = item.dataVoted;
                this.didVote = item.didVote;
                this.inRecievedList = true;
                this.surveyKey = item.$key;
                //this.commentsSurveyKey = item.commentsSurveyKey;
                if (item.commentsArray) {
                  item.commentsArray.map(a => {
                    for (let key in a) {
                      this.oldCommentsArray.push({ key: key, value: a[key] });
                    }
                  })
                }
              }
            })
          })
          this.dataService.getSurvey(this.surveyId, this.userId).subscribe((data:Survey) => {
            this.loader.dismiss();
            this.survey = data;
            if(this.survey.disabled === true){
              this.surveyDisabled = true;
            }
            if (!this.inRecievedList) {
              const recievedSurvey: RecievedSurvey = {
                votedUserName: this.profile.firstName || this.authenticatedUser.displayName || this.authenticatedUser.email,
                fromId: this.userId,
                description: this.survey.description || null,
                title: this.survey.title,
                fromKey: this.surveyId,
                didVote: false
              }
              this.dataService.saveRecievedSurvey(recievedSurvey, this.authenticatedUser).then(data => {
  
                this.surveyKey = data.key;
                localStorage.removeItem('userId');
                localStorage.removeItem('surveyId');
              })
            }
            if (this.votedData) {
              let x;
              for (x in this.survey) {
                if (Array.isArray(this.survey[x])) {
                  this.survey[x].map(data => {
                    this.votedData.map(id => {
                      if (data.id === id) {
                        data.votedOption = true;
                      }
                    })
                  })
                }
              }
            }
            if (this.survey.surveyDate) {
              const a = `${this.survey.surveyDate} ${this.survey.surveyTime}`;
              const surveyDateTime = new Date(a);
              this.dateTime = moment(surveyDateTime);
              this.dataService.getCurrentTime().then(data => {
                const serverTime = moment(data)
                const surveyTime = this.dateTime;
                let s = serverTime.isSameOrAfter(surveyTime);
                if (s) {
                  this.surveyTimeout = true;
                }
              })
            }
            if (this.survey.type === "Single") {
              this.typeSingle = true;
            }
            else if (this.survey.type === "Multiple") {
              this.typeMultiple = true;
            }
            else {
              this.typeComments = true;
            }
          });
        }
        else {
          this.sameUser = true;
          localStorage.removeItem('userId');
          localStorage.removeItem('surveyId');
          this.loader.dismiss();
        }
      }
      else {
        localStorage.setItem('userId', this.userId);
        localStorage.setItem('surveyId', this.surveyId);
        const toast = this.toastCtrl.create({
          message: 'You need to login before submiting your Vote',
          duration: 2000,
          position: 'bottom'
        })
        toast.present();
        this.loader.dismiss();
        this.navCtrl.setRoot("LoginPage")
      }
    })
  }

  playVideo(videoId) {
    this.youtube.openVideo(videoId);
  }

  checkedOption(id) {
    this.votedItems[0] = id;
  }

  getCheckedList() {
    let x;
    for (x in this.survey) {
      if (Array.isArray(this.survey[x])) {
        this.survey[x].map(data => {
          if (data.checked === true) {
            this.votedItems.push(data.id);
          }
        })
      }
    }
  }

  getComments() {
    this.survey.commentsData.map(data => {
      var item = {};
      if (typeof data.surveyComments == typeof undefined) {
        this.empty = true;
      }
      else {
        item[data.name] = data.surveyComments;
        this.commentsArray.push(item);
      }
    })
    // this.commentsVote = {
    //   votedSurveyKey: this.surveyId,
    //   votedPersonName: this.profile.firstName || this.authenticatedUser.displayName || this.authenticatedUser.displayName,
    //   commentsArray: this.commentsArray
    // }
  }

  submitVote() {
    if (this.typeComments) {
      this.getComments();
      if (this.empty) {
        const toast = this.toastCtrl.create({
          message: 'You need to fill all the feilds to submit the survey',
          duration: 2000,
          position: 'bottom'
        })
        toast.present();
        this.empty = false;
        this.commentsArray = [];
        return;
      }
    }
    else {
      if (this.typeMultiple) {
        this.getCheckedList();
      }
      if (this.votedItems.length === 0) {
        const toast = this.toastCtrl.create({
          message: 'You need to atleast select one option to vote',
          duration: 2000,
          position: 'bottom'
        })
        toast.present();
        return;
      }
    }
    let x;
    for (x in this.survey) {
      if (Array.isArray(this.survey[x])) {
        if(x === "optionsData" || x === "commentsData"){
          this.survey[x].map(data => {
            delete data.surveyComments;
            delete data.votedOption;
            data.checked = false;
            if (this.votedData) {
              this.votedData.map(id => {
                if (data.id === id) {
                  data.totalVotes--;
                }
              })
            }
            if (this.votedItems) {
              this.votedItems.map(id => {
                if (data.id === id) {
                  data.totalVotes++;
                }
              })
            }
          })
        }
      }
    }
    const recievedSurvey: RecievedSurvey = {
      votedUserName: this.profile.firstName || this.authenticatedUser.displayName || this.authenticatedUser.email,
      fromId: this.userId,
      description: this.survey.description || null,
      title: this.survey.title,
      fromKey: this.surveyId,
      dataVoted: this.votedItems,
      commentsArray: this.commentsArray,
      didVote: true
    }


    if (!this.didVote) {
      this.survey.surveyVotes++;
      if(this.votedItems.length == 0){
        delete this.votedItems;
      }
      const votedData: {} = {
        votedPersonName: this.profile.firstName || this.authenticatedUser.displayName || this.authenticatedUser.email,
        votedTime: firebase.database.ServerValue.TIMESTAMP,
        action: 'submitted',
        votedOption : this.votedItems || this.commentsArray
      }
      if (this.survey.votesData) {
        this.survey.votesData.push(votedData)
      }
      else {
        this.survey.votesData = [votedData];
      }
    }
    else {
      const votedData: {} = {
        votedPersonName: this.profile.firstName || this.authenticatedUser.displayName || this.authenticatedUser.email,
        votedTime: firebase.database.ServerValue.TIMESTAMP,
        action: 'updated',
        votedOption : this.votedItems || this.commentsArray
      }
      if (this.survey.votesData) {
        this.survey.votesData.push(votedData)
      }
      else {
        this.survey.votesData = [votedData];
      }
    }
    this.dataService.updateSurvey(this.userId, this.survey, this.surveyId);
    this.dataService.updateRecievedSurvey(recievedSurvey, this.surveyKey, this.authenticatedUser)
    localStorage.removeItem('userId');
    localStorage.removeItem('surveyId');
    const toast = this.toastCtrl.create({
      message: 'You have succesfully submitted your vote for the survey',
      duration: 2000,
      position: 'bottom'
    })
    toast.present();
    this.navCtrl.push('TabsPage');
  }
}
