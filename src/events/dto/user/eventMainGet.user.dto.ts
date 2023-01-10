import { EventGalleryAdminGetDto } from 'src/events_gallery/dto';
import { EventInstructorAdminGetDto } from 'src/events_instructor/dto';
import { EventScheduleAdminGetDto } from 'src/events_schedule/dto';
import { EventTestimonialAdminGetDto } from 'src/events_testimonial/dto';

export interface EventMainUserGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  url?: string;
  title?: string;
  from_date?: string;
  to_date?: string;
  time?: string;
  amount?: string;
  banner?: string;
  video?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  draft?: boolean;
  paid?: boolean;
  EventAbout?: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    heading?: string;
    description?: string;
    image?: string;
  };
  EventCallToAction?: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    heading?: string;
    description?: string;
  };
  EventGallery?: EventGalleryAdminGetDto[];
  EventInstructor?: EventInstructorAdminGetDto[];
  EventSchedule?: EventScheduleAdminGetDto[];
  EventTestimonial?: EventTestimonialAdminGetDto[];
}
