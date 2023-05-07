import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class ScheduleDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsDateString()
  datetime: Date;
}
