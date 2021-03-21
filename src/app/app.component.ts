import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Week } from './reminder/models/week';
import { MonthState } from './reminder/redux/reducers/month.reducer';
import { ReminderService } from './reminder/services/reminder.service';
import * as actions from './reminder/redux/actions/month.actions';
import * as selectors from './reminder/redux/selectors/month.selectors';
import { cityName, monthsName } from './static';
import { Observable } from 'rxjs';
import { Day } from './reminder/models/day';
import { Reminder } from './reminder/models/reminder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  idCity = '3688689';
  listWeathers = [];
  month: number = 0;
  cityName = cityName;
  monthsName = monthsName;
  weeks$: Observable<ReadonlyArray<Week>>;
  @Output() weeksOutput = new EventEmitter<Week[]>();
  weeks: Week[] = [];
  constructor(
    private store: Store<{ month: MonthState }>,
    public service: ReminderService
  ) {
    this.weeks$ = this.store.pipe(select(selectors.getWeeks));
  }

  ngOnInit(): void {
    //this.loadWeather();
    this.month = new Date().getMonth();
    this.changeState();
    this.mapWeeks();
  }

  changeState() {
    this.store.dispatch(actions.changeMonth({ idMonth: this.month }));
  }

  mapWeeks() {
    this.weeks$.subscribe((weeks) => {
      this.weeks = [];
      weeks.forEach((w) => {
        const week = new Week(this.month, w.idWeek);
        week.idWeek = w.idWeek;
        week.days = [];
        w.days.forEach((d) => {
          const day = new Day(this.month, w.idWeek, d.idDay);
          day.reminders = [];
          d.reminders.forEach((r) => {
            const reminder = new Reminder(
              r.idMonth,
              r.idWeek,
              r.idDay,
              r.id,
              r.message,
              r.hour,
              r.color
            );
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
  changeWeek(weeks: Week[]) {
    this.store.dispatch(actions.changeWeeks({ weeks: weeks }));
  }
}
