import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, IonicPage, NavController } from "ionic-angular";
import { User } from "../../interfaces/user";
import { FirebaseService } from "../../services/firebase.service";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-password-reset",
  templateUrl: "password-reset.html"
})
export class PasswordResetPage implements OnInit {
  user = {} as User;

  resetPasswordForm: FormGroup;
  email: FormControl;

  constructor(
    public firebaseService: FirebaseService,
    public nav: NavController,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  resetPassword(user: User) {
    this.firebaseService.resetPassword(user.email).then(
      user => {
        let alert = this.alertCtrl.create({
          message:
            "We hebben je een password reset link verzonden, naar het bij ons bekende e-mail adres",
          buttons: [
            {
              text: "Okay!",
              role: "cancel",
              handler: () => {
                this.nav.push(LoginPage);
              }
            }
          ]
        });
        alert.present();
      },
      error => {
        let errorAlert = this.alertCtrl.create({
          message:
            "<p>Het opgegeven e-mail adres bestaat niet!</p><p>Probeer het aub nogmaals</p>",
          buttons: [
            {
              text: "Okay!",
              role: "cancel"
            }
          ]
        });
        errorAlert.present();
      }
    );
  }

  createFormControls() {
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
    ]);
  }

  createForm() {
    this.resetPasswordForm = new FormGroup({
      email: this.email
    });
  }

  toLogin() {
    this.nav.push(LoginPage);
  }
}
