import { IsNotEmpty, IsString } from 'class-validator';

export class EventScheduleAdminCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  heading: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
