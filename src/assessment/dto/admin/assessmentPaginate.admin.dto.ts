import { AssessmentAdminGetDto } from './assessmentGet.admin.dto';

export interface AssessmentAdminPaginateDto {
  count: number;
  data: AssessmentAdminGetDto[];
}
