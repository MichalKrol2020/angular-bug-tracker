import {bugStatusMap} from "../../const/bug-status-select-data";
import {bugClassificationMap} from "../../const/bug-classification-select-data";
import {bugSeverityMap} from "../../const/bug-severity-select-data";

export class BugEnumMapper
{
  public static mapStatusToEnumName(status: string)
  {
    return bugStatusMap[status as keyof typeof bugStatusMap];
  }

  public static mapClassificationToEnumName(classification: string)
  {
    return bugClassificationMap[classification as keyof typeof bugClassificationMap];
  }

  public static mapSeverityToEnumName(severity: string)
  {
    return bugSeverityMap[severity as keyof typeof bugSeverityMap];
  }


}
