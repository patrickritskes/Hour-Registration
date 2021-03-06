import { Component } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import {
  ActionSheetController,
  ModalController,
  NavController
} from "ionic-angular";
import { map } from "rxjs/operators";
import { User } from "../../interfaces/user";
import { FirebaseService } from "../../services/firebase.service";
import { AdminprofilePage } from "../adminprofile/adminprofile";
import { LoginPage } from "../login/login";
import { TimeRegistrationPage } from "../time-registration/time-registration";
import { SingleUserProfilePage } from "../single-user-profile/single-user-profile";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  ownUserProfile: User;
  adminUserProfile: Array<User> = [];
  userProfiles: Array<User> = [];
  isCurrentUserAdmin: boolean;

  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private firebaseService: FirebaseService
  ) {
    this.checkProfileRole();
    this.getUserProfiles();
  }

  /* Check the current user role */
  private checkProfileRole() {
    /* Check if a user is logged in */
    this.afAuth.authState.subscribe(userdata => {
      if (userdata !== null) {
        const dbRef = firebase.database().ref(`users/` + userdata.uid);
        dbRef.on("value", snapshot => {
          this.adminUserProfile = [];
          const role = snapshot.val().role;

          /* Flag if a user is admin */
          if (role === "admin") {
            this.isCurrentUserAdmin = true;
            this.adminUserProfile = snapshot.val();
          }

          if (role === "user") {
            this.isCurrentUserAdmin = false;
            this.ownUserProfile = snapshot.val();
          }
        });
      }
    });
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
        this.userProfiles = profiles;
      });
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

  // Admin only
  showAdminProfile(adminProfileData: User) {
    let adminModal = this.modalCtrl.create(AdminprofilePage, {
      adminUser: adminProfileData
    });
    adminModal.present();
  }

  userSelected(user: User) {
    this.navCtrl.push(SingleUserProfilePage, {
      user: user
    });
  }

  // User only
  toTimeRegistraion() {
    this.navCtrl.push(TimeRegistrationPage);
  }
}
