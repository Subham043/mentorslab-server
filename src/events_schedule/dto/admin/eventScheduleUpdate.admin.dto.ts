import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EventScheduleAdminUpdateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  heading: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
