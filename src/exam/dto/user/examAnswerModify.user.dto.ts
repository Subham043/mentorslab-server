import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CorrectAnswerAdmin } from '../../../exam_question_answer/dto/admin/correctAnswer.admin.enum';
import { Status } from './status.user.enum';
import { Transform } from 'class-transformer';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class ExamAnswerUserModifyDto {
  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === Status.ABORTED)
  reason: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @IsEnum(CorrectAnswerAdmin)
  @ValidateIf((o) => o.status === Status.ONGOING)
  selected_answer: CorrectAnswerAdmin;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
