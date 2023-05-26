import { AssessmentUserGetDto } from './assessmentGet.user.dto';

export interface AssessmentUserPaginateDto {
  count: number;
  data: AssessmentUserGetDto[];
}
