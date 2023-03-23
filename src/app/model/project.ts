import {Bug} from "./bug";
import {User} from "./user";

export class Project
{
  id!: number;
  name!: string;
  description!: string;
  participants!: User[];
  bugs!: Bug[];
}
