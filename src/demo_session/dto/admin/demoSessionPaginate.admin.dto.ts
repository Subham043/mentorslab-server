import { DemoSessionAdminGetDto } from './demoSessionGet.admin.dto';

export interface DemoSessionAdminPaginateDto {
  count: number;
  data: DemoSessionAdminGetDto[];
}
