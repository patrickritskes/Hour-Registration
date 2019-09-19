import { Component, OnInit, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Nav, Platform } from "ionic-angular";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { FirebaseService } from "../services/firebase.service";

@Component({
  templateUrl: "app.html"
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private firebaseService: FirebaseService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    this.firebaseService.hasSession$.subscribe(hasSession => {
      if (hasSession) {
        this.nav.setRoot(HomePage);
      } else {
        this.nav.setRoot(LoginPage);
      }
    });
  }
}
