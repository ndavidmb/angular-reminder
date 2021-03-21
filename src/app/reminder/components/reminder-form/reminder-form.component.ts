import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Day } from '../../models/day';
import { Reminder } from '../../models/reminder';
import { Week } from '../../models/week';
import { MonthState } from '../../redux/reducers/month.reducer';
import { ReminderService } from '../../services/reminder.service';
import * as actions from '../../redux/actions/month.actions';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss'],
})
export class ReminderFormComponent implements OnInit {
  formGroup: FormGroup;
  reminder: any;
  day: Day = new Day();
  createMode: boolean = false;
  date: Date = new Date();
  hours: number[] = [];
  weeks$: Observable<ReadonlyArray<Week>> = new Observable();
  weeks: Week[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReminderFormComponent>,
    private store: Store<{ month: MonthState }>,
    public fb: FormBuilder,
    public service: ReminderService
  ) {
    this.formGroup = this.buildForm();
  }

  ngOnInit(): void {
    for (let i = 1; i <= 12; i++) {
      this.hours.push(i);
    }
    this.initialForm();
    this.mapWeeks();
  }

  mapWeeks() {
    this.weeks$.subscribe((weeks) => {
      this.weeks = [];
      weeks.forEach((w) => {
        const week = new Week();
        week.idWeek = w.idWeek;
        week.days = [];
        w.days.forEach((d) => {
          const day = new Day();
          day.idWeek = w.idWeek;
          day.idDay = d.idDay;
          day.reminders = [];
          d.reminders.forEach((r) => {
            const reminder = new Reminder();
            reminder.reminder = r.reminder;
            reminder.hour = r.hour;
            reminder.color = r.color;
            reminder.id = r.id;
            day.reminders.push(reminder);
          });
          day.disable = d.disable;
          day.weather = d.weather;
          week.days.push(day);
        });
        this.weeks.push(week);
      });
    });
  }

  initialForm() {
    var hour = this.reminder?.hour.getHours();
    var period = 0;
    if (hour > 12) {
      hour -= 12;
      period = 12;
    }
    this.formGroup.controls.message.setValue(
      this.reminder !== null ? this.reminder.reminder : ''
    );
    this.formGroup.controls.hour.setValue(this.reminder === null ? 1 : hour);
    this.formGroup.controls.period.setValue(
      this.reminder === null ? 0 : period
    );
    this.formGroup.controls.color.setValue(
      this.reminder === null ? '#00ccff' : this.reminder.color
    );
  }

  buildForm() {
    return (this.formGroup = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(30)]],
      hour: ['', Validators.required],
      period: ['', Validators.required],
      color: ['', Validators.required],
    }));
  }
  save() {
    const reminder = new Reminder();
    reminder.color = this.formGroup.controls.color.value;
    reminder.reminder = this.formGroup.controls.message.value;
    let hour = +this.formGroup.controls.hour.value;
    const period = +this.formGroup.controls.period.value;
    hour += period;
    const date = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate(),
      hour,
      0,
      0
    );
    reminder.hour = date;
    this.saveOrUpdate(reminder);
    this.dialogClose();
  }

  getDayInWeeks() {
    return this.weeks
      .find((w) => w.idWeek == this.day.idWeek)
      ?.days.find((d: any) => d.idDay == this.day.idDay);
  }

  saveOrUpdate(reminder: Reminder) {
    const day = this.getDayInWeeks();
    // SAVE
    if (this.createMode && day) {
      var lastReminder = day.reminders[day.reminders.length - 1];
      if (lastReminder) {
        reminder.id = lastReminder.id + 1;
      } else {
        reminder.id = 1;
      }
      day.reminders.push(reminder);
      day.reminders.sort((a, b) => a.hour.getTime() - b.hour.getTime());
      // UPDATE
    } else if (day) {
      var r = day?.reminders.findIndex((f) => f.id == this.reminder.id);
      day.reminders[r] = reminder;
      day.reminders[r].id = this.reminder.id;
      day.reminders.sort((a, b) => a.hour.getTime() - b.hour.getTime());
    }
  }

  delete() {
    const day = this.getDayInWeeks();
    if (day) {
      const index = day.reminders.findIndex((f) => f.id === this.reminder.id);
      console.log('index ', index);
      day.reminders.splice(index, 1);
    }
    this.dialogClose();
  }

  changeMonth(weeks: Week[]) {
    this.store.dispatch(actions.changeWeeks({ weeks: weeks }));
  }

  dialogClose() {
    this.changeMonth(this.weeks);
    this.dialogRef.close();
  }
}
