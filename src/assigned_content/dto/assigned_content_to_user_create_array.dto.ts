import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { AssignedContentToUserCreateDto } from './assigned_content_to_user_create.dto';

export class AssignedContentToUserCreateArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => AssignedContentToUserCreateDto)
  assigned_content_array: AssignedContentToUserCreateDto[];
}
