import { ContentAdminGetDto } from 'src/content/dto';
import { UserProfileGetDto } from 'src/user/dto';

export interface AssignedContentGetAdminDto {
  id?: number;
  assignedAt?: Date;
  assignedById?: number;
  assignedToId?: number;
  assignedContentId?: number;
  assignedBy?: UserProfileGetDto;
  assignedTo?: UserProfileGetDto;
  assignedContent?: ContentAdminGetDto;
}
