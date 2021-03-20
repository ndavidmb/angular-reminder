import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as actions from '../../redux/actions/month.actions';
import * as selectors from '../../redux/selectors/month.selectors';
import { MonthState } from '../../redux/reducers/month.reducer';
import { Week } from '../../models/week';
import { Day } from '../../models/day';
import { ReminderFormComponent } from '../reminder-form/reminder-form.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
})
export class ReminderListComponent implements OnInit {
  month$: Observable<MonthState>;
  weeks$: Observable<Week[]>;
  idMonth$: Observable<number>;
  value = 0;
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

  constructor(
    private store: Store<{ month: MonthState }>,
    public dialog: MatDialog
  ) {
    this.month$ = store.select('month');
    this.idMonth$ = this.store.pipe(select(selectors.getIdMonth));
    this.weeks$ = this.store.pipe(select(selectors.getWeeks));
  }

  ngOnInit(): void {
    const date = new Date();
    this.value = date.getMonth();
    this.changeMonth(date.getMonth());
  }

  changeMonth(value: number) {
    console.log(value);
    const weeks: Week[] = this.getWeeks(value);
    this.store.dispatch(actions.changeMonth({ idMonth: value, weeks: weeks }));
  }

  getWeeks(month: number) {
    const weeks: Week[] = [];
    const newDate = new Date();
    newDate.setMonth(month);
    newDate.setDate(1);
    let firstDay = newDate.getDay();
    const finalDate = new Date();
    const nextMonth: number = Number(month) + 1;
    finalDate.setMonth(nextMonth);
    finalDate.setDate(0);
    const days = finalDate.getDate();
    let i = 1;
    while (i <= days) {
      let week = new Week();
      for (let j = 0; j < 7; j++) {
        let day = new Day();
        day.idDay = i;
        if (firstDay !== 0 || i > days) {
          day.idDay = 0;
          firstDay--;
        } else {
          i++;
        }
        week.days.push(day);
      }
      weeks.push(week);
    }
    return weeks;
  }
  openForm(createMode: boolean, day: Day) {
    const dialogRef = this.dialog.open(ReminderFormComponent, {
      width: '500px',
      disableClose: true,
    });
    const date = new Date(2021, this.value, day.idDay);
    dialogRef.componentInstance.createMode = createMode;
    dialogRef.componentInstance.date = date;
  }
}
