import {Bug} from "./bug";

export interface BugPageableResponse
{
  content: Bug[],
  pageable:
    {
      pageNumber: number,
      pageSize: number
    },
  totalPages: number,
  totalElements: number
}
