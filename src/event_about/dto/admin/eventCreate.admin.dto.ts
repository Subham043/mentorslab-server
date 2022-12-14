import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  HasExtension,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class EventAdminCreateDto {
  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6)
  @HasExtension(['jpg', 'jpeg', 'webp', 'png'])
  image: MemoryStoredFile;
}
