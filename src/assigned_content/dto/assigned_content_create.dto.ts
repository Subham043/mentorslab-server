import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignedContentCreateDto {

  @IsNotEmpty()
  @IsNumber()
  assignedToId: number;
  
  @IsNotEmpty()
  @IsNumber()
  assignedContentId: number;
}
