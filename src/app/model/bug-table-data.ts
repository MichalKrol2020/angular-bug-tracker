import {BugSortOrderEnum} from "../enum/bug-sort-order-enum";

export interface BugTableData
{
  label: string,
  orderBy: BugSortOrderEnum,
  class: string
}
