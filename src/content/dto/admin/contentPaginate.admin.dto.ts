import { ContentAdminGetDto } from './contentGet.admin.dto';

export interface ContentAdminPaginateDto {
  count: number;
  data: ContentAdminGetDto[];
}
