import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { absoluteDate, monthsName } from '../../../static';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { ReminderService } from '../../services/reminder.service';
import { Week } from '../../models/week';
import { Day } from '../../models/day';
import { Reminder } from '../../models/reminder';
import { MonthState } from '../../redux/reducers/month.reducer';
import * as selectors from '../../redux/selectors/month.selectors';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
})
export class ReminderListComponent {
  @Input() weeks: Week[] = [];
  @Output() weeksOutput = new EventEmitter<Week[]>();
  @Input() set city(idCity: string) {
    this.service.get(idCity).subscribe((res) => {
      this.listWeathers = res;
      const date = new Date();
      this.month = date.getMonth();
      //this.changeMonth();
    });
  }

  _month: number = 0;
  @Input() set month(month: number) {
    this.getWeeks(month);
    this._month = month;
  }
  get month() {
    return this._month;
  }

  idMonth$: Observable<number>;
  listWeathers = [];
  monthsName = monthsName;

  constructor(
    private store: Store<{ month: MonthState }>,
    public dialog: MatDialog,
    public service: ReminderService
  ) {
    this.idMonth$ = this.store.pipe(select(selectors.getIdMonth));
  }

  // get Weeks on the month
  getWeeks(month: number) {
    const weeks: Week[] = [];
    const firstDayDate = absoluteDate(month, 1);
    const currentDate = absoluteDate();
    let firstDay = firstDayDate.getDay();
    const days = absoluteDate(month + 1, 0).getDate();
    let i = 1, idWeek = 1;
    while (i <= days) {
      let week = new Week(this.month, idWeek++);
      for (let j = 0; j < 7; j++) {
        let day = new Day(this.month, week.idWeek, i);
        if (firstDay !== 0 || i > days) {
          day.idDay = 0;
          firstDay--;
        } else {
          day.disable = this.compareDates(currentDate, firstDayDate);
          day.weather = this.dayWeather(firstDayDate);
          firstDayDate.setDate(day.idDay);
          i++;
        }
        week.days.push(day);
      }
      weeks.push(week);
    }
    this.weeksOutput.emit(weeks);
  }

  compareDates(currentDate: Date, date: Date): boolean {
    const difference = currentDate.getTime() - date.getTime();
    if (difference > 86400000) {
      return true;
    }
    return false;
  }

  dayWeather(date: Date): string {
    const weatherOfDay: any = this.listWeathers.find(
      (f: any) =>
        f.date.getDate() === date.getDate() &&
        f.date.getMonth() === date.getMonth() &&
        f.date.getFullYear() === date.getFullYear()
    );
    return weatherOfDay ? weatherOfDay.weather : '';
  }

  // CRUD OF REMINDERS
  deleteAll(day: Day) {
    day.reminders = [];
    this.weeksOutput.emit(this.weeks);
  }
  openForm(createMode: boolean, day: Day, reminder?: Reminder) {
    if (!reminder) {
      reminder = new Reminder(
        day.idMonth,
        day.idWeek,
        day.idDay,
        0,
        '',
        new Date(),
        '#00ccff'
      );
    }
    this.dialog.open(ReminderFormComponent, {
      width: '500px',
      disableClose: true,
      data: {
        createMode: createMode,
        day: day,
        reminder: reminder,
      },
    });
  }
}
