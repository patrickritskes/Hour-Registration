import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-single-user-profile',
  templateUrl: 'single-user-profile.html',
})
export class SingleUserProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    if (this.navParams.data && this.navParams.data.user && this.navParams.data.user.timeReg) {
      console.log(this.navParams.data.user.timeReg)
    }
  }

}
