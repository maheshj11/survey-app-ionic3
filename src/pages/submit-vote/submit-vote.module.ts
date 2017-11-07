import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitVotePage } from './submit-vote';

@NgModule({
  declarations: [
    SubmitVotePage,
  ],
  imports: [
    IonicPageModule.forChild(SubmitVotePage),
  ],
})
export class SubmitVotePageModule {}
