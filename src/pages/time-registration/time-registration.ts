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
  weekNumber: number;
  weekBeginAndEndDay: any;
  timeRegForm: FormGroup;
  totalWorkedHours: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.totalWorkedHours = 0;
    this.timeRegForm = new FormGroup({
      maandag: new FormControl(0),
      dinsdag: new FormControl(0),
      woensdag: new FormControl(0),
      donderdag: new FormControl(0),
      vrijdag: new FormControl(0),
      zaterdag: new FormControl(0),
      zondag: new FormControl(0)
    });
    moment.locale("nl");
    let startOfWeek = moment().startOf("isoWeek");
    let endOfWeek = moment().endOf("isoWeek");
    let day = startOfWeek;

    while (day <= endOfWeek) {
      this.weekDays.push(day.toDate());
      day = day.clone().add(1, "d");
    }

    const beginWeekDay = moment().day(1);
    const endWeekDay = moment().day(7);
    this.weekBeginAndEndDay =
      beginWeekDay.format("DD MMM") + " - " + endWeekDay.format("DD MMM Y");
    this.weekNumber = moment().week();
  }

  saveTimeReg() {
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
    const saveToDB = {
      [moment().year()]: {
        [moment().week()]: {
          days: rawValues
        }
      }
    };
    this.db.list(`/users/`).update(`${uid}/timeReg/`, saveToDB);
  }

  private incrementSumValue(previousValue: number, currentValue: number) {
    return previousValue + currentValue;
  }

  private sortDays(a, b) {
    let daysOfWeek = {
      maandag: 1,
      dinsdag: 2,
      woensdag: 3,
      donderdag: 4,
      vrijdag: 5,
      zaterdag: 6,
      zondag: 7
    };
    // return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
  }
}
