import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyStatsPage } from './survey-stats';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    SurveyStatsPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyStatsPage),
    ChartsModule
  ],
})
export class SurveyStatsPageModule {}
