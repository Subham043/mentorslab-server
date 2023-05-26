import { AssessmentQuestionAnswerAdminGetDto } from './assessmentQuestionAnswerGet.admin.dto';

export interface AssessmentQuestionAnswerAdminPaginateDto {
  count: number;
  data: AssessmentQuestionAnswerAdminGetDto[];
}
