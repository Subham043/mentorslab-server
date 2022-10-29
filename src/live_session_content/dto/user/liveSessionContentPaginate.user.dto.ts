import { LiveSessionContentUserGetDto } from './liveSessionContentGet.user.dto';

export interface LiveSessionContentUserPaginateDto {
  count: number;
  data: LiveSessionContentUserGetDto[];
}
