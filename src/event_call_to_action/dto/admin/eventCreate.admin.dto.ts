import { IsNotEmpty } from 'class-validator';

export class EventAdminCreateDto {
  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  description: string;
}
