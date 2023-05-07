import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasExtension,
} from 'nestjs-form-data';
import { CorrectAnswerAdmin } from './correctAnswer.admin.enum';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class ExamQuestionAnswerAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  question: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_a: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_b: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_c: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_d: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsEnum(CorrectAnswerAdmin)
  correct_answer: CorrectAnswerAdmin;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  duration: number;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  marks: number;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
