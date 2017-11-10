import { Survey } from '../../models/survey/survey.interface';
import { DataService } from './../../providers/data/data.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment'

@IonicPage({
  segment: 'survey-stats',
  defaultHistory: ['TabsPage']
})
@Component({
  selector: 'page-survey-stats',
  templateUrl: 'survey-stats.html',
})
export class SurveyStatsPage implements OnInit {

  survey: any
  surveyId: string;
  userId: string;
  loader: Loading;
  surveyData = [];
  typeComments = false;
  commentsArray = [];
  matchedOption = [];
  // pie
  pieChartLabels: string[];
  pieChartData: number[];
  pieChartType: string;
  items = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private youtube: YoutubeVideoPlayer,
    private dataService: DataService,
    public _DomSanitizer: DomSanitizer) {
    this.loader = this.loadingCtrl.create({
      content: 'Loading Survey'
    })
  }

  ngOnInit() {
    this.surveyId = this.navParams.get('surveyId');
    this.loader.present();
    this.userId = this.navParams.get('userId');
    this.dataService.getSurvey(this.surveyId, this.userId).subscribe((data: Survey) => {
      this.loader.dismiss();
      this.survey = data;
      if (this.survey.type === "Comments") {
        this.typeComments = true;
        this.commentsArray = [];
        if (data.votesData) {
          data.votesData.map(a => {
            a.votedOption.map(data => {
              for (let key in data) {
                this.commentsArray.push({ key: key, value: data[key] });
              }
            })
            let time = moment.unix(a.votedTime / 1000).format("DD MMM YYYY hh:mm a");
            this.surveyData.push({ action: a.action, name: a.votedPersonName, commentsArray: this.commentsArray, votedTime: time });
          })
        }
      }
      else {
        let y = new Array();
        let z = new Array();
        this.survey.optionsData.map((data, i) => {
          if (data.name) {
            this.surveyData.push({ name: data.name, votes: data.totalVotes });
            y.push(data.name);
          }
          if (data.imageUrl) {
            this.surveyData.push({ imageUrl: data.imageUrl, votes: data.totalVotes });
            y.push(`Image ${i + 1}`);
          }
          if (data.videoId) {
            this.surveyData.push({ videoId: data.videoId, videoThumbnail: data.videoThumbnail, videoTitle: data.videoTitle, votes: data.totalVotes });
            y.push(`Video ${i + 1}`);
          }
          if (data.audioUrl) {
            this.surveyData.push({ audioData: data.audioUrl, votes: data.totalVotes });
            y.push(`Video ${i + 1}`);
          }
          z.push(data.totalVotes);
        })
        this.pieChartData = z
        this.pieChartType = 'pie';
        this.pieChartLabels = y;
        if (data.votesData) {
          data.votesData.map(a => {
            this.matchedOption = [];
            a.votedOption.map(item => {
              this.survey.optionsData.map((data, i) => {
                if (item === data.id) {
                  if (data.name) {
                    this.matchedOption.push({ name: data.name, votes: data.totalVotes });
                  }
                  if (data.imageUrl) {
                    this.matchedOption.push({ imageUrl: data.imageUrl, votes: data.totalVotes });
                  }
                  if (data.videoId) {
                    this.matchedOption.push({ videoId: data.videoId, videoThumbnail: data.videoThumbnail, videoTitle: data.videoTitle, votes: data.totalVotes });
                  }
                  if (data.audioUrl) {
                    this.matchedOption.push({ audioData: data.audioUrl, votes: data.totalVotes });
                  }
                }
              })
            });
            let time = moment.unix(a.votedTime / 1000).format("DD MMM YYYY hh:mm a");
            this.items.push({ action: a.action, votedPerson: a.votedPersonName, votedTime: time, votedOptions: this.matchedOption });
          })
        }
      }
    })
  }

  playVideo(videoId) {
    this.youtube.openVideo(videoId);
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
