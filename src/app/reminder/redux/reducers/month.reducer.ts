import { createReducer, on } from '@ngrx/store';
import { Week } from '../../models/week';
import * as actions from '../actions/month.actions';

export interface MonthState {
  idMonth: number;
  weeks: Week[];
}

export const initialState: MonthState = {
  idMonth: new Date().getMonth(),
  weeks: [],
};

const _monthReducer = createReducer(
  initialState,
  on(actions.changeMonth, (state, { idMonth, weeks }) => ({
    idMonth: idMonth,
    weeks: weeks,
  }))
);

export function monthReducer(state: any, action: any) {
  return _monthReducer(state, action);
}
