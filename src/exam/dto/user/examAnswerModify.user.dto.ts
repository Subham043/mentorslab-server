import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CorrectAnswerAdmin } from '../../../exam_question_answer/dto/admin/correctAnswer.admin.enum';
import { Status } from './status.user.enum';

export class ExamAnswerUserModifyDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === Status.ABORTED)
  reason: string;

  @IsOptional()
  @IsEnum(CorrectAnswerAdmin)
  @ValidateIf((o) => o.status === Status.ONGOING)
  selected_answer: CorrectAnswerAdmin;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
