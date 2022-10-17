import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignedContentToUserCreateAdminDto {
  @IsNotEmpty()
  @IsNumber()
  assignedToId: number;
}
