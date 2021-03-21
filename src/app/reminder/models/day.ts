import {Reminder} from "./reminder";

export class Day {
  idWeek: number = 0;
  idDay: number = 0;
  reminders: Reminder[] = [];
  weather: any;
  disable: boolean = false;
}
