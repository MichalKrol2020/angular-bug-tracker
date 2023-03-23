import {Project} from "./project";

export interface ProjectPageableResponse
{
  content: Project[],
  pageable:
    {
      pageNumber: number,
      pageSize: number
    },
  totalPages: number,
  totalElements: number
}
