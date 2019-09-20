import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import moment from "moment";

@IonicPage()
@Component({
  selector: "page-time-registration",
  templateUrl: "time-registration.html"
})
export class TimeRegistrationPage implements OnInit {
  weekDays: Array<Date> = [];
  weekNumber: any;
  weekBeginAndEndDay: any;
  timeRegForm: FormGroup;
  totalWorkedHours = 0;
  currentDate = moment();
  currentYear: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) { }

  ionViewDidEnter() {
    moment.locale("nl");
    this.calculateWeekday();
  }

  ngOnInit() {
    this.timeRegForm = new FormGroup({
      maandag: new FormControl(0),
      dinsdag: new FormControl(0),
      woensdag: new FormControl(0),
      donderdag: new FormControl(0),
      vrijdag: new FormControl(0),
      zaterdag: new FormControl(0)
    });
  }

  previousWeek() {
    this.currentDate = this.currentDate.subtract(1, "week");
    this.calculateWeekday();
  }

  nextWeek() {
    this.currentDate = this.currentDate.add(1, "week");
    this.calculateWeekday();
  }

  currentWeek() {
    this.currentDate = moment();
    this.calculateWeekday();
  }

  swipeEvent(event: any) {
    // Swipe from left to right = forward
    if (event.direction === 2) {
      this.nextWeek();
    }

    // Swipe from right to left = back
    if (event.direction === 1 || event.direction === 4) {
      this.previousWeek();
    }
  }

  saveTimeReg(year: number, weekNumber: number) {
    let uid = this.afAuth.auth.currentUser.uid;
    let workedHours = [];
    const rawValues = this.timeRegForm.getRawValue();
    Object.keys(rawValues).forEach(values => {
      if (rawValues[values]) {
        let replacedValue = rawValues[values].replace(":", ".");
        workedHours.push(+replacedValue);
      }
    });
    if (workedHours.length > 0) {
      this.totalWorkedHours = workedHours
        .reduce(this.incrementSumValue)
        .toFixed(2);
    }
    this.db
      .list(`/users/`)
      .update(`${uid}/timeReg/${year}/${weekNumber}/days/`, rawValues);
  }

  private incrementSumValue(previousValue: number, currentValue: number) {
    return previousValue + currentValue;
  }

  private calculateWeekday() {
    let startOfWeek = this.currentDate.clone().startOf("week");
    let endOfWeek = this.currentDate.clone().endOf('week');
    let days = [];
    for (let i = 2; i <= 7; i++) {
      days.push(
        moment(startOfWeek)
          .add(i, "days")
          .format("DD MMM")
      );
    }
    this.currentYear = moment(endOfWeek).year();
    this.weekDays = days;
    this.weekNumber = this.currentDate.week();
    this.weekBeginAndEndDay = this.weekDays[0] + " - " + this.weekDays[5];
    this.getTimeReg();
  }

  private getTimeReg() {
    let uid = this.afAuth.auth.currentUser.uid;
    let dbRef = this.db.database.ref(`users/${uid}/timeReg/`);
    dbRef.on("value", snapshot => {
      const dataSnapshot = snapshot.val();
      Object.keys(dataSnapshot).forEach(year => {
        if (+year === this.currentDate.year()) {
          Object.keys(dataSnapshot[year]).forEach(weekNumber => {
            if (+weekNumber === this.currentDate.week()) {
              const filledTimeReg = dataSnapshot[year][weekNumber].days;
              this.timeRegForm = new FormGroup({
                maandag: new FormControl(filledTimeReg.maandag || 0),
                dinsdag: new FormControl(filledTimeReg.dinsdag || 0),
                woensdag: new FormControl(filledTimeReg.woensdag || 0),
                donderdag: new FormControl(filledTimeReg.donderdag || 0),
                vrijdag: new FormControl(filledTimeReg.vrijdag || 0),
                zaterdag: new FormControl(filledTimeReg.zaterdag || 0)
              });
            }
          })
        }
      })
    });
  }
}
