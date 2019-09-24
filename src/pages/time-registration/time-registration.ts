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
  currentYear: number;
  currentMonth: number;
  weekNumber: any;
  weekBeginAndEndDay: any;
  timeRegForm: FormGroup;
  totalWorkedHours = 0;
  totalMonthlyWorkedHours = 0;
  currentDate = moment();

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
      maandag: new FormControl(),
      dinsdag: new FormControl(),
      woensdag: new FormControl(),
      donderdag: new FormControl(),
      vrijdag: new FormControl(),
      zaterdag: new FormControl()
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

  saveTimeReg(year: number, month: number, weekNumber: number) {
    let uid = this.afAuth.auth.currentUser.uid;
    let workedHours = [];
    const rawValues = this.timeRegForm.getRawValue();
    Object.keys(rawValues).forEach(values => {
      if (rawValues[values]) {
        // parse string to float
        let replacedValue = rawValues[values].replace(":", ".");
        workedHours.push(+replacedValue);
      }
    });
    // Calculate week workinghours when save to db
    if (workedHours.length > 0) {
      this.totalWorkedHours = workedHours
        .reduce(this.incrementSumValue)
        .toFixed(2);
    }
    this.db
      .list(`/users/`)
      .update(`${uid}/timeReg/${year}/${month}/${weekNumber}/days/`, rawValues);
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
    this.currentMonth = moment(endOfWeek).month() + 1;
    this.weekDays = days;
    this.weekNumber = this.currentDate.week();
    this.weekBeginAndEndDay = this.weekDays[0] + " - " + this.weekDays[5];
    this.getTimeReg(this.currentYear, this.currentMonth, this.weekNumber)
  }

  private getTimeReg(year: number, month: number, weekNumber: number) {
    let uid = this.afAuth.auth.currentUser.uid;
    let workedHours = [];
    let monthlyWorkedHours = [];
    // Query DB based on incoming year, month and weeknumber
    let dbDaysRef = this.db.database.ref(`users/${uid}/timeReg/${year}/${month}/${weekNumber}/days/`);
    dbDaysRef.on("value", dataSnapshot => {
      const dayWithValues = dataSnapshot.val();
      if (dayWithValues) {
        this.timeRegForm.setValue({
          maandag: dayWithValues.maandag || '',
          dinsdag: dayWithValues.dinsdag || '',
          woensdag: dayWithValues.woensdag || '',
          donderdag: dayWithValues.donderdag || '',
          vrijdag: dayWithValues.vrijdag || '',
          zaterdag: dayWithValues.zaterdag || ''
        });
        // Calculate week working hours
        Object.keys(dayWithValues).forEach(days => {
          if (dayWithValues[days]) {
            let replacedValue = dayWithValues[days].replace(":", ".");
            workedHours.push(parseFloat(replacedValue));
          }
        });
        if (workedHours && workedHours.length > 0) {
          this.totalWorkedHours = workedHours
            .reduce(this.incrementSumValue)
            .toFixed(2);
        }
      }
      // Reset empty form controls when navigating
      else {
        this.timeRegForm.reset()
        this.totalWorkedHours = 0;
        this.totalMonthlyWorkedHours = 0;
      }
    });
    let dbMonthRef = this.db.database.ref(`users/${uid}/timeReg/${year}/${month}/`);
    dbMonthRef.on("value", monthDataSnapshot => {
      const monthWithValues = monthDataSnapshot.val();
      if (monthWithValues) {
        Object.keys(monthWithValues).forEach(monthValues => {
          Object.keys(monthWithValues[monthValues].days).forEach(days => {
            let replacedMonthValues = monthWithValues[monthValues].days[days].replace(":", ".");
            monthlyWorkedHours.push(parseFloat(replacedMonthValues));
          })
        });
        if (monthlyWorkedHours && monthlyWorkedHours.length > 0) {
          this.totalMonthlyWorkedHours = monthlyWorkedHours.reduce(this.incrementSumValue).toFixed(2);
        }
      }
    });
  }
}
