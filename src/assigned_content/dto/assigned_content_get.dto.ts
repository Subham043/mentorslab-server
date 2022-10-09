import { ContentGetDto } from 'src/content/dto';
import { UserGetDto } from 'src/user/dto';

export interface AssignedContentGetDto {
  id?: number;
  assignedAt?: Date;
  assignedById?: number;
  assignedToId?: number;
  assignedContentId?: number;
  assignedBy?: UserGetDto;
  assignedTo?: UserGetDto;
  assignedContent?: ContentGetDto;
}
