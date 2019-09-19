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
  weekDays: Array<string> = [];
  weekNumber: string;
  timeRegForm: FormGroup;
  totalWorkedHours: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.totalWorkedHours = 0;
    this.timeRegForm = new FormGroup({
      timeInput0: new FormControl(),
      timeInput1: new FormControl(),
      timeInput2: new FormControl(),
      timeInput3: new FormControl(),
      timeInput4: new FormControl(),
      timeInput5: new FormControl()
    });
    moment.locale("nl");
    const currentMoment = moment().subtract(3, "days");
    const endMoment = moment().add(3, "days");
    while (currentMoment.isBefore(endMoment, "day")) {
      this.weekNumber = currentMoment.format("w");
      const parsedWeekdays = currentMoment.format("ddd DD MMM");
      this.weekDays.push(parsedWeekdays);
      currentMoment.add(1, "days");
    }
  }

  saveTimeReg() {
    let workedHours = [];
    const rawValues = this.timeRegForm.getRawValue();
    Object.keys(rawValues).forEach(values => {
      workedHours.push(+rawValues[values]);
    });
    this.totalWorkedHours = workedHours.reduce(this.incrementSumValue);
    console.log(this.totalWorkedHours);
  }

  private incrementSumValue(previousValue, currentValue) {
    return previousValue + currentValue;
  }
}
