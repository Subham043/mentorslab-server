import { AssignedContentGetAdminDto } from 'src/assigned_content/dto';

export interface UserProfileAdminGetDto {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  verified?: boolean;
  blocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  ContentAssignedTo?: AssignedContentGetAdminDto[];
}
