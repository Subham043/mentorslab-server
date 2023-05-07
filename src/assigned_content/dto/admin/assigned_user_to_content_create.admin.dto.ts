import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ValidHtml } from 'src/common/decorator/valid_html.decorator';

export class AssignedUserToContentCreateAdminDto {
  @Transform((param) => ValidHtml(param.value))
  @IsNotEmpty()
  @IsNumber()
  assignedContentId: number;
}
