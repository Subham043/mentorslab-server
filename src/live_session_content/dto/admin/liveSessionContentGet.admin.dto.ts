import { UserProfileGetDto } from 'src/user/dto';
export interface LiveSessionContentAdminGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  image?: string;
  heading?: string;
  description?: string;
  amount?: string;
  draft?: boolean;
  paid?: boolean;
  User?: UserProfileGetDto;
}
