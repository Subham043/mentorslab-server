import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class EventAdminCreateDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  heading: string;

  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  description: string;
}
