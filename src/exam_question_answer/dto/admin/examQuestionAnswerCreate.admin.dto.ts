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
import { ContentTypeAdmin } from 'src/content/dto';

export class ExamQuestionAnswerAdminCreateDto {
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
  @IsEnum(ContentTypeAdmin)
  correct_answer: ContentTypeAdmin;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;

  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
