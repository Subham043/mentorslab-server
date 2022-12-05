import { ExamAdminGetDto } from './examGet.admin.dto';

export interface ExamAdminPaginateDto {
  count: number;
  data: ExamAdminGetDto[];
}
