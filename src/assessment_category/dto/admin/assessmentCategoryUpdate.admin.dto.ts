import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class AssessmentCategoryAdminUpdateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  choices: string;

  @Transform((param) => ValidHtml(param.value))
  @IsString()
  @IsNotEmpty()
  message: string;

  @Transform((param) => ValidHtml(param.value))
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  @IsBoolean()
  draft: boolean;
}
