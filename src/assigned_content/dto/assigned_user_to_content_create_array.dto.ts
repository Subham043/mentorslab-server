import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { AssignedUserToContentCreateDto } from './assigned_user_to_content_create.dto';

export class AssignedUserToContentCreateArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => AssignedUserToContentCreateDto)
  assigned_content_array: AssignedUserToContentCreateDto[];
}
