import { createAction, props } from '@ngrx/store';
import {Week} from '../../models/week';

export const changeMonth = createAction(
  'Change month',
  props<{ idMonth: number, weeks: Week[] }>()
);

export const changeWeeks = createAction(
  'Change week',
  props<{ weeks: Week[] }>()
)
