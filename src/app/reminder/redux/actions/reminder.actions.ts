import { createAction, props } from '@ngrx/store';
import { Reminder } from '../../models/reminder';

export const addReminder = createAction(
  'addReminder',
  props<{ reminder: Reminder }>()
);
export const updateReminder = createAction(
  'updateReminder',
  props<{ id: number; reminder: Reminder }>()
);
export const deleteReminder = createAction(
  'deleteReminder',
  props<{ id: number }>()
);
export const deleteAllReminder = createAction(
  'deleteAllReminder',
  props<{ date: Date }>()
);
