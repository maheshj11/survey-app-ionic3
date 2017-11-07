import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditSurveyPage } from './edit-survey';

@NgModule({
  declarations: [
    EditSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(EditSurveyPage),
  ],
})
export class EditSurveyPageModule {}
