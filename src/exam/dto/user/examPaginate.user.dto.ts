import { ExamUserGetDto } from './examGet.user.dto';

export interface ExamUserPaginateDto {
  count: number;
  data: ExamUserGetDto[];
}
