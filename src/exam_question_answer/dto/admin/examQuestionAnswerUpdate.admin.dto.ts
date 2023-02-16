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

export class ExamQuestionAnswerAdminUpdateDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer_a: string;

  @IsString()
  @IsNotEmpty()
  answer_b: string;

  @IsString()
  @IsNotEmpty()
  answer_c: string;

  @IsString()
  @IsNotEmpty()
  answer_d: string;

  @IsNotEmpty()
  @IsEnum(CorrectAnswerAdmin)
  correct_answer: CorrectAnswerAdmin;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  marks: number;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
