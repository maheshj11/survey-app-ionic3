import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage({
  segment: 'tabs'
})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: string;
  tab2Root: string;
  tab3Root: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public platform: Platform) {
    this.tab1Root = "HomePage";
    this.tab2Root = "VotePage";
    this.tab3Root = "ProfilePage";
  }
}
