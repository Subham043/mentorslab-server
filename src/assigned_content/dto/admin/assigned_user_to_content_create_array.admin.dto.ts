import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { AssignedUserToContentCreateAdminDto } from './assigned_user_to_content_create.admin.dto';

export class AssignedUserToContentCreateArrayAdminDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => AssignedUserToContentCreateAdminDto)
  assigned_content_array: AssignedUserToContentCreateAdminDto[];
}
