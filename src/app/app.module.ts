import { registerLocaleData } from "@angular/common";
import localeNl from "@angular/common/locales/nl";
import { ErrorHandler, LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { AdminprofilePage } from "../pages/adminprofile/adminprofile";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { PasswordResetPage } from "../pages/password-reset/password-reset";
import { RegisterPage } from "../pages/register/register";
import { TimeRegistrationPage } from "../pages/time-registration/time-registration";
import { FirebaseService } from "../services/firebase.service";
import { MyApp } from "./app.component";
import { FIREBASE_CONFIG } from "./firebase.config";
import { SingleUserProfilePage } from "../pages/single-user-profile/single-user-profile";

registerLocaleData(localeNl, "nl");
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    PasswordResetPage,
    AdminprofilePage,
    SingleUserProfilePage,
    TimeRegistrationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    PasswordResetPage,
    AdminprofilePage,
    SingleUserProfilePage,
    TimeRegistrationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FirebaseService,
    { provide: LOCALE_ID, useValue: "nl-NL" }
  ]
})
export class AppModule {}
