import { AssessmentCategoryAdminGetDto } from './assessmentCategoryGet.admin.dto';

export interface AssessmentCategoryAdminPaginateDto {
  count: number;
  data: AssessmentCategoryAdminGetDto[];
}
