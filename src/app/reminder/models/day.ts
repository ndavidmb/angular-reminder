import {Reminder} from "./reminder";

export class Day {
  constructor(
    public idMonth: number,
    public idWeek: number,
    public idDay: number,
    public reminders: Reminder[] = [],
    public weather?: any,
    public disable: boolean = false,
  ) {}
}
