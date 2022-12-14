import { EventUserGetDto } from './eventGet.user.dto';

export interface EventUserPaginateDto {
  count: number;
  data: EventUserGetDto[];
}
