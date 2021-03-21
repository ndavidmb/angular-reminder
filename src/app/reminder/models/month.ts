import {Week} from "./week"

export class Month {
  constructor(
    public idMonth: number,
    public week: Week[] = []
  ){}
}
