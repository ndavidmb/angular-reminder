import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {Reminder} from '../../models/reminder';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss'],
})
export class ReminderFormComponent implements OnInit {
  formGroup: FormGroup;
  createMode: boolean = false;
  date: Date = new Date();
  hours:number[] = []

  constructor(
    public dialogRef: MatDialogRef<ReminderFormComponent>,
    public fb: FormBuilder
  ) {
    this.formGroup = this.buildForm();
  }

  ngOnInit(): void {
    for(let i = 1; i <= 12; i++) {
      this.hours.push(i);
    }
    this.initialForm();
  }

  initialForm() {
    this.formGroup.controls.hour.setValue(1);
    this.formGroup.controls.period.setValue(1);
  }

  buildForm() {
    return (this.formGroup = this.fb.group({
      message: ['', [ Validators.required, Validators.maxLength(30) ]],
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
    const date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    console.log(date);
    date.setHours(hour);
    reminder.hour = date;
    console.log(hour);
    console.log(reminder);
  }
}
