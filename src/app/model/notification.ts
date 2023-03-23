import {User} from "./user";
import {DateUtils} from "../utils/date-utils";

export class Notification
{
  id!: number;
  title!: string;
  description!: string;
  seen!: boolean;
  sendDate!: Date;
  sender!: User;


  constructor(id: number, title: string, description: string, seen: boolean, sendDate: Date, sender: User) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.seen = seen;
    this.sendDate = sendDate;
    this.sender = sender;
  }

  public getTimeSinceSendDate()
  {
    return DateUtils.getRelativeTimeSince(this.sendDate);
  }
}
