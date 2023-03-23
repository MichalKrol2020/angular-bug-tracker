import {User} from "./user";

export interface UserPageableResponse
{
  content: User[],
  pageable:
    {
      pageNumber: number,
      pageSize: number
    },
  totalPages: number,
  totalElements: number
}
