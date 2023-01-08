import { EventInstructorAdminGetDto } from './eventInstructorGet.admin.dto';

export interface EventInstructorAdminPaginateDto {
  count: number;
  data: EventInstructorAdminGetDto[];
}
