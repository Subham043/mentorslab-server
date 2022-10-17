import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignedUserToContentCreateAdminDto {
  @IsNotEmpty()
  @IsNumber()
  assignedContentId: number;
}
