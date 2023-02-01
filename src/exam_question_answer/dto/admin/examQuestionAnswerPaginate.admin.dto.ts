import { ExamQuestionAnswerAdminGetDto } from './examQuestionAnswerGet.admin.dto';

export interface ExamQuestionAnswerAdminPaginateDto {
  count: number;
  data: ExamQuestionAnswerAdminGetDto[];
}
