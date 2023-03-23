import {BugStatusEnum} from "../enum/bug-status.enum";

const statusAssigned = 'Assigned';
const statusNew = 'New';
const statusFixed = 'Fixed';
const statusPendingRetest = 'Pending Retest';
const statusRetest = 'Retest';
const statusVerified = 'Verified';
const statusClosed = 'Closed';

export const BugStatusSelectData =
  [
    {
      option: statusFixed,
      value: BugStatusEnum.FIXED
    },
    {
      option: statusPendingRetest,
      value: BugStatusEnum.PENDING_RETEST
    },
    {
      option: statusRetest,
      value: BugStatusEnum.RETEST
    },
    {
      option: statusVerified,
      value: BugStatusEnum.VERIFIED
    },
    {
      option: statusClosed,
      value: BugStatusEnum.CLOSED
    },
  ]

export const BugStatusProjectLeaderSelectData =
  [
    {
      option: statusAssigned
    },
    {
      option: statusNew
    },
    {
      option: statusFixed
    },
    {
      option: statusPendingRetest
    },
    {
      option: statusRetest
    },
    {
      option: statusVerified
    },
    {
      option: statusClosed
    },
  ]

export const bugStatusMap =
  {
    [statusNew]: BugStatusEnum.NEW,
    [statusFixed]: BugStatusEnum.FIXED,
    [statusPendingRetest]: BugStatusEnum.PENDING_RETEST,
    [statusRetest]: BugStatusEnum.RETEST,
    [statusAssigned]: BugStatusEnum.ASSIGNED,
    [statusVerified]: BugStatusEnum.VERIFIED,
    [statusClosed]: BugStatusEnum.CLOSED
  }


