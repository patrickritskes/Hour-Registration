import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleUserProfilePage } from './single-user-profile';

@NgModule({
  declarations: [
    SingleUserProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(SingleUserProfilePage),
  ],
})
export class SingleUserProfilePageModule {}
