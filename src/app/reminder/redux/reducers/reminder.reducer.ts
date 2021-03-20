import { createReducer, on } from '@ngrx/store';
import {Reminder} from '../../models/reminder';
import * as actions from '../actions/reminder.actions'

export interface State {
  days: any[];
  reminders: Reminder[];
  city: string;
  date: Date;
}

export const initialState: State = {
  days: [],
  reminders: [],
  city: 'Bogotá',
  date: new Date()
};

const _reminderReducer = createReducer(
  initialState,
  on(actions.addReminder, (state, {reminder}) =>  {
    state.reminders.push(reminder)
    console.log(state.reminders);
    return state;
  }),
  on(actions.updateReminder, (state, {id, reminder}) => {
    var result = state.reminders.find((re) => re.id === id);
    result = { ...reminder };
    console.log(result);
    console.log(state.reminders);
    return state;
  }),
  on(actions.deleteReminder, (state, {id}) => {
    const index = state.reminders.findIndex((re) => re.id === id);
    state.reminders.splice(index, 1);
    return state;
  }),
  on(actions.deleteAllReminder, (state, { date }) => {

  }),
)

export function reminderReducer(state: State, action) {
  return _reminderReducer(state, action);
}
