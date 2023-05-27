import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { CorrectAnswerAdmin } from '../../../exam_question_answer/dto/admin/correctAnswer.admin.enum';
import { Status } from './status.user.enum';
import { Transform } from 'class-transformer';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class AssessmentAnswerUserModifyDto {
  @Transform((param) => ValidHtml(param.value))
  @Transform((param) => Number(param.value))
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => o.status === Status.ONGOING)
  selected_answer_id: CorrectAnswerAdmin;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
