import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase } from "angularfire2/database";
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
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage implements OnInit {
  user = {} as User;
  registerForm: FormGroup;

  email: FormControl;
  password: FormControl;
  name: FormControl;
  address: FormControl;
  city: FormControl;
  zipcode: FormControl;
  phoneNumber: FormControl;

  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afDataBase: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  onRegister(user: User) {
    this.firebaseService.registerUser(user.email, user.password).then(
      newUser => {
        this.afDataBase
          .object(`users/${newUser.user.uid}`)
          .set({
            name: user.name,
            address: user.address,
            city: user.city,
            zipcode: user.zipcode,
            phoneNumber: user.phoneNumber,
            role: "user"
          })
          .then(() => this.navCtrl.setRoot(HomePage));
      },
      error => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            message:
              "<p>Registreren is helaas niet gelukt!</p><p>Probeer het aub nogmaals.</p>",
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

  createForm() {
    this.registerForm = new FormGroup({
      name: this.name,
      email: this.email,
      password: this.password,
      address: this.address,
      zipcode: this.zipcode,
      city: this.city,
      phoneNumber: this.phoneNumber
    });
  }

  createFormControls() {
    this.name = new FormControl("", [Validators.required]);
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")
    ]);
    this.password = new FormControl("", [
      Validators.required,
      Validators.minLength(6)
    ]);
    this.address = new FormControl("", [Validators.required]);
    this.zipcode = new FormControl("", [
      Validators.required,
      Validators.pattern("[1-9][0-9]{3}s?[a-zA-Z]{2}"),
      Validators.maxLength(6)
    ]);
    this.city = new FormControl("", [Validators.required]);
    this.phoneNumber = new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
  }

  toLogin() {
    this.navCtrl.push(LoginPage);
  }
}
