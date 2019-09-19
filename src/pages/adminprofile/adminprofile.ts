import { Component, OnInit } from "@angular/core";
import firebase from "firebase/app";
import {
  ActionSheetController,
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { map } from "rxjs/operators";
import { User } from "../../interfaces/user";
import { FirebaseService } from "../../services/firebase.service";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-adminprofile",
  templateUrl: "adminprofile.html"
})
export class AdminprofilePage implements OnInit {
  adminData: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.getUserProfiles();
  }

  private getUserProfiles() {
    this.firebaseService
      .getUserProfiles()
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(profiles => {
        profiles.forEach(profile => {
          if (profile.key === firebase.auth().currentUser.uid) {
            return (this.adminData = Object.assign(profile));
          }
        });
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  logOut() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Weet je zeker dat je wilt uitloggen?",
      buttons: [
        {
          text: "Ja, Uitloggen aub",
          role: "destructive",
          handler: () => {
            this.firebaseService.logoutUser().then(() => {
              this.navCtrl.push(LoginPage);
            });
          }
        },
        {
          text: "Annuleer",
          role: "cancel",
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }
}
