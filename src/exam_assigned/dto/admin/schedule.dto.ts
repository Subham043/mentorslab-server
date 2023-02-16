import { IsDateString, IsNotEmpty } from 'class-validator';

export class ScheduleDto {
  @IsNotEmpty()
  @IsDateString()
  datetime: Date;
}
