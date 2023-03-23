import {BugSortOrderEnum} from "../enum/bug-sort-order-enum";
import {UserSortOrderEnum} from "../enum/user-sort-order.enum";
import {ProjectSortOrderEnum} from "../enum/project-sort-order.enum";

export const tableIssuesListData =
[
  {
    label: "ISSUE",
    orderBy: BugSortOrderEnum.NAME,
    class: ''
  },
  {
    label: "CLASSIFICATION",
    orderBy: BugSortOrderEnum.CLASSIFICATION,
    class: ''
  },
  {
    label: "STATUS",
    orderBy: BugSortOrderEnum.STATUS,
    class: ''
  },
  {
    label: "SEVERITY",
    orderBy: BugSortOrderEnum.SEVERITY,
    class: ''
  },
  {
    label: "CREATOR",
    orderBy: BugSortOrderEnum.CREATOR,
    class: ''
  },
  {
    label: "ASSIGNEE",
    orderBy: BugSortOrderEnum.ASSIGNEE,
    class: ''
  },
  {
    label: "CREATION DATE",
    orderBy: BugSortOrderEnum.CREATION_DATE,
    class: ''
  }
]

export const tableParticipantsData =
  [
    {
      label: "FULL NAME",
      orderBy: UserSortOrderEnum.FIRST_NAME
    },
    {
      label: "EMAIL ADDRESS",
      orderBy: UserSortOrderEnum.EMAIL
    },
    {
      label: "SPECIALITY",
      orderBy: UserSortOrderEnum.SPECIALITY
    }
  ]

export const tableAddedIssuesData =
  [
    {
      label: "ISSUE",
      orderBy: BugSortOrderEnum.NAME,
      class: "issue-header-long"
    },
    {
      label: "CLASSIFICATION",
      orderBy: BugSortOrderEnum.CLASSIFICATION,
      class: "classification-header"
    },
    {
      label: "STATUS",
      orderBy: BugSortOrderEnum.STATUS,
      class: "status-header"
    },
    {
      label: "SEVERITY",
      orderBy: BugSortOrderEnum.SEVERITY,
      class: "severity-header"
    },
    {
      label: "PROJECT",
      orderBy: BugSortOrderEnum.PROJECT,
      class: "project-header"
    },
    {
      label: "ASSIGNEE",
      orderBy: BugSortOrderEnum.ASSIGNEE,
      class: "assignee-header"
    },
    {
      label: "CREATION DATE",
      orderBy: BugSortOrderEnum.CREATION_DATE,
      class: "creation-date-header"
    }
  ]


export const tableProjectLeaderIssuesData =
  [
    {
      label: "ISSUE",
      orderBy: BugSortOrderEnum.NAME,
      class: "issue-header"
    },
    {
      label: "CLASSIFICATION",
      orderBy: BugSortOrderEnum.CLASSIFICATION,
      class: "classification-header"
    },
    {
      label: "STATUS",
      orderBy: BugSortOrderEnum.STATUS,
      class: "status-header"
    },
    {
      label: "SEVERITY",
      orderBy: BugSortOrderEnum.SEVERITY,
      class: "severity-header"
    },
    {
      label: "PROJECT",
      orderBy: BugSortOrderEnum.PROJECT,
      class: "project-header"
    },
    {
      label: "ASSIGNEE",
      orderBy: BugSortOrderEnum.ASSIGNEE,
      class: "assignee-header"
    },
    {
      label: "CREATION DATE",
      orderBy: BugSortOrderEnum.CREATION_DATE,
      class: "creation-date-header"
    }
  ]

export const tableAssignedIssuesData =
  [
    {
      label: "ISSUE",
      orderBy: BugSortOrderEnum.NAME,
      class: "issue-header-assignee"
    },
    {
      label: "CLASSIFICATION",
      orderBy: BugSortOrderEnum.CLASSIFICATION,
      class: "classification-header-assignee"
    },
    {
      label: "STATUS",
      orderBy: BugSortOrderEnum.STATUS,
      class: "status-header-assignee"
    },
    {
      label: "SEVERITY",
      orderBy: BugSortOrderEnum.SEVERITY,
      class: "severity-header-assignee"
    },
    {
      label: "PROJECT",
      orderBy: BugSortOrderEnum.PROJECT,
      class: "project-header-assignee"
    }
  ]

export const tableProjectsData =
  [
    {
      label: "PROJECT",
      orderBy: ProjectSortOrderEnum.NAME
    }
  ]
