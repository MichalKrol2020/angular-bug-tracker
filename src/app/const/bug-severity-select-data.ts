import {BugSeverityEnum} from "../enum/bug-severity.enum";

const critical = "Critical";
const high = "High";
const medium = "Medium";
const low = "Low";

export const BugSeveritySelectData =
  [
    {
      option: critical
    },
    {
      option: high
    },
    {
      option: medium
    },
    {
      option: low
    }
  ]

export const bugSeverityMap =
  {
    [critical]: BugSeverityEnum.CRITICAL,
    [high]: BugSeverityEnum.HIGH,
    [medium]: BugSeverityEnum.MEDIUM,
    [low]: BugSeverityEnum.LOW
  }
