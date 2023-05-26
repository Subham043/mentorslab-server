import { Transform } from 'class-transformer';
import {
  IsBoolean,
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
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class AssessmentQuestionAnswerAdminUpdateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  question: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_a: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNumber()
  @IsNotEmpty()
  answer_a_choice_id: number;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_b: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNumber()
  @IsNotEmpty()
  answer_b_choice_id: number;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_c: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNumber()
  @IsNotEmpty()
  answer_c_choice_id: number;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  answer_d: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNumber()
  @IsNotEmpty()
  answer_d_choice_id: number;

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
