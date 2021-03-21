import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as actions from '../../redux/actions/month.actions';
import * as selectors from '../../redux/selectors/month.selectors';
import { MonthState } from '../../redux/reducers/month.reducer';
import { Week } from '../../models/week';
import { Day } from '../../models/day';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ReminderService } from '../../services/reminder.service';
import { Reminder } from '../../models/reminder';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
})
export class ReminderListComponent implements OnInit {
  month$: Observable<MonthState>;
  weeks$: Observable<ReadonlyArray<Week>>;
  idMonth$: Observable<number>;
  reminder: any = null;
  value = 0;
  idCity = '3688689';
  listWeathers = [];
  cityPicker = [
    { name: 'Bogotá, Colombia.', id: '3688689' },
    { name: 'Medellín, Colombia.', id: '3674962' },
    { name: 'New York, United States', id: '5128581' },
    { name: 'London, United States', id: '4517009' },
  ];
  monthsName = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 },
  ];
  weeks: Week[] = [];

  constructor(
    private store: Store<{ month: MonthState }>,
    public dialog: MatDialog,
    public service: ReminderService
  ) {
    this.month$ = store.select('month');
    this.idMonth$ = this.store.pipe(select(selectors.getIdMonth));
    this.weeks$ = this.store.pipe(select(selectors.getWeeks));
  }

  ngOnInit(): void {
    this.loadWeather();
    this.mapWeeks();
  }

  loadWeather() {
    this.service.get(this.idCity).subscribe((res) => {
      this.listWeathers = res;
      const date = new Date();
      this.value = date.getMonth();
      this.changeMonth(date.getMonth());
    });
  }

  changeMonth(value: number) {
    const weeks: Week[] = this.getWeeks(value);
    this.store.dispatch(actions.changeMonth({ idMonth: value, weeks: weeks }));
  }
  deleteAll(day: Day) {
    const d = this.weeks
      .find((w) => w.idWeek == day.idWeek)
      ?.days.find((d: any) => d.idDay == day.idDay);
    if(d) d.reminders = [];
    this.store.dispatch(actions.changeWeeks({ weeks: this.weeks }));
  }
  getWeeks(month: number) {
    const weeks: Week[] = [];
    const firstDayDate = new Date(2021, month, 1, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let firstDay = firstDayDate.getDay();
    const lastDayDate = new Date(2021, month + 1, 0, 0, 0, 0);
    const days = lastDayDate.getDate();

    let i = 1;
    let idWeek = 1;
    while (i <= days) {
      let week = new Week();
      week.idWeek = idWeek;
      idWeek++;
      for (let j = 0; j < 7; j++) {
        let day = new Day();
        day.idDay = i;
        day.idWeek = week.idWeek;
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
    return weeks;
  }
  update(day: Day, reminder: Reminder) {
    this.reminder = reminder;
    this.openForm(false, day);
  }
  openForm(createMode: boolean, day: Day) {
    const dialogRef = this.dialog.open(ReminderFormComponent, {
      width: '500px',
      disableClose: true,
    });
    const date = new Date(2021, this.value, day.idDay);
    dialogRef.componentInstance.createMode = createMode;
    dialogRef.componentInstance.date = date;
    dialogRef.componentInstance.day = day;
    dialogRef.componentInstance.weeks$ = this.weeks$;
    dialogRef.componentInstance.reminder = this.reminder;
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
}
