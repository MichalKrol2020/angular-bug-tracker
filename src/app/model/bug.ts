import {User} from "./user";
import {Project} from "./project";

export class Bug
{
  id!: number;
  name: string;
  classification: string;
  status: string;
  severity: string;
  description: string;
  creator: User | undefined;
  creationDate!: Date;
  assignee: User | undefined;
  project: Project | undefined;
  expanded: boolean;


  constructor()
  {
    this.name = '';
    this.classification = '';
    this.status = '';
    this.severity = '';
    this.description = '';
    this.expanded = false;
  }
}
