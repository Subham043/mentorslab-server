import { EnquiryAdminGetDto } from './enquiryGet.admin.dto';

export interface EnquiryAdminPaginateDto {
  count: number;
  data: EnquiryAdminGetDto[];
}
