import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class AssignedContentToUserCreateAdminDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsNumber()
  assignedToId: number;
}
