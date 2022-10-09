import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignedContentToUserCreateDto {
  @IsNotEmpty()
  @IsNumber()
  assignedToId: number;
}
