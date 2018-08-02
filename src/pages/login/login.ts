import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams
} from "ionic-angular";
import { User } from "../../interfaces/user";
import { FirebaseService } from "../../services/firebase.service";
import { HomePage } from "../home/home";
import { PasswordResetPage } from "../password-reset/password-reset";
import { RegisterPage } from "../register/register";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage implements OnInit {
  user = {} as User;
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseService: FirebaseService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
    ]);
    this.password = new FormControl("", [
      Validators.required,
      Validators.minLength(6)
    ]);
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  onLogin(user: User) {
    this.firebaseService.loginUser(user.email, user.password).then(
      () => {
        this.navCtrl.setRoot(HomePage);
      },
      error => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message:
              "<p>Inloggen is helaas niet gelukt!</p><p>Probeer het aub nogmaals.</p>",
            buttons: [
              {
                text: "Okay!",
                role: "cancel"
              }
            ]
          });
          alert.present();
        });
      }
    );

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  toRegister() {
    this.navCtrl.push(RegisterPage);
  }

  toResetPassword() {
    this.navCtrl.push(PasswordResetPage);
  }
}
