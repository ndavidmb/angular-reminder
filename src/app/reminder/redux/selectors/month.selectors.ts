import {createFeatureSelector, createSelector} from "@ngrx/store";
import {MonthState} from "../reducers/month.reducer";

export const getMonthState = createFeatureSelector<MonthState>('month');

export const getIdMonth = createSelector(getMonthState, (state: MonthState) => state.idMonth);
export const getWeeks = createSelector(getMonthState, (state: MonthState) => state.weeks);
