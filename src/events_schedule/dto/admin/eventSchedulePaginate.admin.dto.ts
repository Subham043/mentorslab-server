import { EventScheduleAdminGetDto } from './eventScheduleGet.admin.dto';

export interface EventScheduleAdminPaginateDto {
  count: number;
  data: EventScheduleAdminGetDto[];
}
