import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignedUserToContentCreateDto {
  @IsNotEmpty()
  @IsNumber()
  assignedContentId: number;
}
