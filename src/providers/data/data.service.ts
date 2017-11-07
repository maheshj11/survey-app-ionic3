import { Survey } from './../../models/survey/survey.interface';
import { Profile } from './../../models/profile/profile.interface';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from 'firebase/app';
import * as moment from 'moment';
import * as firebase from 'firebase'

@Injectable()
export class DataService {

  surveyList: FirebaseListObservable<{}>
  survey: FirebaseObjectObservable<{}>
  profile: FirebaseObjectObservable<Profile>
  recievedSurveyList: FirebaseListObservable<{}>
  commentsData: FirebaseListObservable<{}>

  constructor(private database: AngularFireDatabase) {
  }

  getCurrentTime = () => {
    return new Promise((resolve, reject) => {
      firebase.database().ref(".info/serverTimeOffset").on("value", function (snap) {
        var offset = snap.val();
        resolve(moment().valueOf() + offset);
      });
    });
  }
  getSurveys(user: User) {
    return this.surveyList = this.database.list(`/users/${user.uid}/surveys/`)
  }

  storeToken(data, uid) {
    this.database.database.ref().child('/user-tokens/').child(uid).set(data)
  }

  deleteSurvey(user: User, survey) {
    this.database.list(`/users/${user.uid}/surveys/${survey.$key}`).remove();
  }

  async saveSurvey(user: User, survey) {
    this.surveyList = this.database.list(`/users/${user.uid}/surveys/`);
    try {
      await this.surveyList.push(survey);
    }
    catch (error) {
      console.log(error);
    }
  }

  async updateSurvey(userId, survey, key) {
    this.surveyList = this.database.list(`/users/${userId}/surveys/`);
    try {
      await this.surveyList.set(key, survey);
    }
    catch (error) {
      console.log(error);
    }
  }

  getProfile(user: User) {
    return this.profile = this.database.object(`/users/${user.uid}/profile/`);
  }

  saveProfile(user: User, profileData: Profile) {
    this.profile = this.database.object(`/users/${user.uid}/profile/`);
    this.profile.set(profileData);
  }
  getSurvey(surveyId, userId) {
    return this.survey = this.database.object(`/users/${userId}/surveys/${surveyId}`);
  }

  saveRecievedSurvey(survey, toId) {
    this.recievedSurveyList = this.database.list(`/users/${toId.uid}/recieved-surveys/`);
    return this.recievedSurveyList.push(survey);
  }

  getRecievedSurveys(user: User) {
    return this.recievedSurveyList = this.database.list(`/users/${user.uid}/recieved-surveys/`)
  }
  updateRecievedSurvey(survey, surveyKey, user) {
    this.recievedSurveyList = this.database.list(`/users/${user.uid}/recieved-surveys/`);
    this.recievedSurveyList.set(surveyKey, survey);
  }

  // saveCommentsSurveyData(userId, commentsData) {
  //   this.commentsData = this.database.list(`/users/${userId}/comments-data/`);
  //   return this.commentsData.push(commentsData);
  // }

  // updateCommentsSurveyData(userId, commentsSurveyKey, commentsData) {
  //   this.commentsData = this.database.list(`/users/${userId}/comments-data/`);
  //   this.commentsData.set(commentsSurveyKey, commentsData);
  // }

  getCommentsData(surveyId, userId) {
    return this.commentsData = this.database.list(`/users/${userId}/comments-data/`)
  }

  uploadAudio(data) {
    const storageRef = firebase.storage().ref('audio-files/')
    var fileName = this.newGuid();
    return storageRef.child(fileName).put(data);
  }
  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  deleteAudio(data) {
    var desertRef = firebase.storage().refFromURL(data)
    desertRef.delete().then(function () {
    }).catch(function (error) {
    });
  }
}
