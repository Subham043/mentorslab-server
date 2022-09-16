import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import {AssignedContentCreateDto} from './assigned_content_create.dto' 

export class AssignedContentCreateArrayDto {

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AssignedContentCreateDto)
  assigned_content_array: AssignedContentCreateDto[];
}
