import {BugClassificationEnum} from "../enum/bug-classification.enum";

const functional = "Functional";
const performance = "Performance";
const usability = "Usability";
const compatibility = "Compatibility";
const security = "Security";

export const BugClassificationSelectData =
  [
    {
      option: functional,
    },
    {
      option: performance,
    },
    {
      option: usability,
    },
    {
      option: compatibility,
    },
    {
      option: security,
    }
  ]

export const bugClassificationMap =
  {
    [functional]: BugClassificationEnum.FUNCTIONAL,
    [performance]: BugClassificationEnum.PERFORMANCE,
    [usability]: BugClassificationEnum.USABILITY,
    [compatibility]: BugClassificationEnum.COMPATIBILITY,
    [security]: BugClassificationEnum.SECURITY
  }
