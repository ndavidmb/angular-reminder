import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Day } from '../../models/day';
import { Reminder } from '../../models/reminder';
import { ReminderService } from '../../services/reminder.service';
import { absoluteDate } from 'src/app/static';

interface Data {
  createMode: boolean;
  day: Day;
  reminder: Reminder;
}

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss'],
})
export class ReminderFormComponent implements OnInit {
  formGroup: FormGroup;
  hours: number[] = [];
  date: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Data,
    public dialogRef: MatDialogRef<ReminderFormComponent>,
    public fb: FormBuilder,
    public service: ReminderService
  ) {
    this.formGroup = this.buildForm();
    this.date = new Date(2021, this.data.day.idMonth, this.data.day.idDay);
  }

  ngOnInit(): void {
    for (let i = 1; i <= 12; i++) {
      this.hours.push(i);
    }
    this.initialForm();
  }

  initialForm() {
    const { message, hour, color } = this.data.reminder;
    var h = hour?.getHours();
    var period = 0;
    if (h > 12) {
      h -= 12;
      period = 12;
    }
    this.formGroup.controls.message.setValue(message);
    this.formGroup.controls.hour.setValue(h);
    this.formGroup.controls.period.setValue(period);
    this.formGroup.controls.color.setValue(color);
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
    let hour = +this.formGroup.controls.hour.value;
    const period = +this.formGroup.controls.period.value;
    //let cloneReminders = [ ...this.data.day.reminders ];
    let last = this.data.day.reminders[this.data.day.reminders.length - 1];
    hour += period;
    const date = absoluteDate();
    date.setHours(hour);
    const reminder = new Reminder(
      this.data.day.idMonth,
      this.data.day.idWeek,
      this.data.day.idDay,
      last ? last.id + 1 : 1,
      this.formGroup.controls.message.value,
      date,
      this.formGroup.controls.color.value
    );
    this.data.createMode ? this.create(reminder) : this.update(reminder);

    this.data.day.reminders.sort((a, b) => a.hour.getTime() - b.hour.getTime());

    this.dialogRef.close();
  }

  create(reminder: Reminder) {
    this.data.day.reminders.push(reminder);
  }
  update(reminder: Reminder) {
    const r = this.data.day.reminders.findIndex(
      (f) => f.id === this.data.reminder.id
    );
    reminder.id = this.data.reminder.id;
    this.data.day.reminders[r] = reminder;
  }

  delete() {
    const day = this.data.day;
    if (day) {
      const index = day.reminders.findIndex(
        (f) => f.id === this.data.reminder.id
      );
      day.reminders.splice(index, 1);
    }
    this.dialogRef.close();
  }
}
