import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeRegistrationPage } from './time-registration';

@NgModule({
  declarations: [
    TimeRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(TimeRegistrationPage),
  ],
})
export class TimeRegistrationPageModule {}
