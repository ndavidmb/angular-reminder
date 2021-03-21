import { createReducer, on } from '@ngrx/store';
import { Week } from '../../models/week';
import * as actions from '../actions/month.actions';

export interface MonthState {
  idMonth: Readonly<number>;
  weeks: ReadonlyArray<Week>;
}

export const initialState: MonthState = {
  idMonth: new Date().getMonth(),
  weeks: [],
};

const _monthReducer = createReducer(
  initialState,
  on(actions.changeMonth, (state, { idMonth }) => ({
    idMonth: idMonth,
    weeks: state.weeks,
  })),
  on(actions.changeWeeks, (state, {weeks}) => ({
    idMonth: state.idMonth,
    weeks: weeks,
  }))
);

export function monthReducer(state: MonthState = initialState, action: any) {
  return _monthReducer(state, action);
}
