import { UserProfileAdminGetDto } from './user.profile.get.dto';

export interface UserProfileAdminPaginateDto {
  count: number;
  data: UserProfileAdminGetDto[];
}
