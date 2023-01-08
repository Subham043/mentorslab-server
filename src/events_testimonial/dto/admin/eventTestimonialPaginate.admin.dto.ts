import { EventTestimonialAdminGetDto } from './eventTestimonialGet.admin.dto';

export interface EventTestimonialAdminPaginateDto {
  count: number;
  data: EventTestimonialAdminGetDto[];
}
