import { EventAdminGetDto } from './eventGet.admin.dto';

export interface EventAdminPaginateDto {
  count: number;
  data: EventAdminGetDto[];
}
