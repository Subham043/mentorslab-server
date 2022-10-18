import { LiveSessionContentAdminGetDto } from './liveSessionContentGet.admin.dto';

export interface LiveSessionContentAdminPaginateDto {
  count: number;
  data: LiveSessionContentAdminGetDto[];
}
