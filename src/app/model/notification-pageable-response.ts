import {Notification} from "./notification";

export interface NotificationPageableResponse
{
  content: Notification[],
  pageable:
    {
      pageNumber: number,
      pageSize: number
    },
  totalPages: number,
  totalElements: number
}
