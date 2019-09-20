import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.totalWorkedHours = 0;
    this.timeRegForm = new FormGroup({
      maandag: new FormControl(),
      dinsdag: new FormControl(),
      woensdag: new FormControl(),
      donderdag: new FormControl(),
      vrijdag: new FormControl(),
      zaterdag: new FormControl(),
      zondag: new FormControl()
    });
    moment.locale("nl");
    let startOfWeek = moment().startOf("isoWeek");
    let endOfWeek = moment().endOf("isoWeek");
    let day = startOfWeek;

    while (day <= endOfWeek) {
      this.weekDays.push(day.toDate());
      day = day.clone().add(1, "d");
    }

    const beginWeekDay = moment().weekday(1);
    const endWeekDay = moment().weekday(5);
    this.weekBeginAndEndDay =
      beginWeekDay.format("DD MMM") + " - " + endWeekDay.format("DD MMM Y");
    this.weekNumber = moment().week();
  }

  saveTimeReg() {
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
  }

  private incrementSumValue(previousValue: number, currentValue: number) {
    return previousValue + currentValue;
  }
}
