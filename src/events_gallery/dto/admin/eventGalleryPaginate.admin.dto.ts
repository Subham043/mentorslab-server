import { EventGalleryAdminGetDto } from './eventGalleryGet.admin.dto';

export interface EventGalleryAdminPaginateDto {
  count: number;
  data: EventGalleryAdminGetDto[];
}
