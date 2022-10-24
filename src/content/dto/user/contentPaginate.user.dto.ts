import { ContentUserGetDto } from './contentGet.user.dto';

export interface ContentUserPaginateDto {
  count: number;
  data: ContentUserGetDto[];
}
