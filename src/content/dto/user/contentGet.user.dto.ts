import { UserProfileGetDto } from 'src/user/dto';
export interface ContentUserGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  type?: string;
  file_path?: string;
  name?: string;
  heading?: string;
  description?: string;
  draft?: boolean;
  restricted?: boolean;
  User?: UserProfileGetDto;
}
