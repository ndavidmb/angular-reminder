export class Reminder {
  constructor(
    public idMonth: number,
    public idWeek: number,
    public idDay: number,
    public id: number,
    public message: string,
    public hour: Date,
    public color: string,
  ) {}
}
