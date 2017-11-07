import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSurveyPage } from './add-survey';

@NgModule({
  declarations: [
    AddSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSurveyPage)
  ],
})
export class AddSurveyPageModule {}
