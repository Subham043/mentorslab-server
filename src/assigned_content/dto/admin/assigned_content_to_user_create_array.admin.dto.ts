import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { AssignedContentToUserCreateAdminDto } from './assigned_content_to_user_create.admin.dto';

export class AssignedContentToUserCreateArrayAdminDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => AssignedContentToUserCreateAdminDto)
  assigned_content_array: AssignedContentToUserCreateAdminDto[];
}
