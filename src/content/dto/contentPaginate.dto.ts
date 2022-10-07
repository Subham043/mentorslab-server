import { ContentGetDto } from './contentGet.dto';

export interface ContentPaginateDto {
  count: number;
  data: ContentGetDto[];
}
