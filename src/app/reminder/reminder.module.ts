import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';
import { ReminderFormComponent } from './components/reminder-form/reminder-form.component';
import { StoreModule } from '@ngrx/store';
import { monthReducer } from './redux/reducers/month.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [ReminderListComponent, ReminderFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatDialogModule,
    HttpClientModule,
    StoreModule.forRoot({ month: monthReducer }),
  ],
  entryComponents: [ReminderFormComponent],
  exports: [ReminderListComponent],
})
export class ReminderModule {}
