import {Day} from "./day";

export class Week {

  constructor(
    public idMonth: number,
    public idWeek: number,
    public days: Day[] = [],
  ) {}
}
