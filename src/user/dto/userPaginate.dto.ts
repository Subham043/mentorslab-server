import { UserGetDto } from './userGet.dto';

export interface UserPaginateDto {
  count: number;
  data: UserGetDto[];
}
