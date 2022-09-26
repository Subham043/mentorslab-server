import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { ContentType } from './content_type.enum';
import { MemoryStoredFile, IsFile, MaxFileSize, HasMimeType } from 'nestjs-form-data';

export class ContentUpdateDto {
    @IsOptional()
    @IsEnum(ContentType)
    type: ContentType;
    
    @IsString()
    @IsOptional()
    file_path: string;
    
    @IsOptional()
    heading: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    draft: boolean;
    
    @IsOptional()
    @IsBoolean()
    restricted: boolean;

    @IsOptional()
    @IsFile()
    @MaxFileSize(1e6)
    @HasMimeType(['image/jpeg', 'image/png'])
    file: MemoryStoredFile;
}