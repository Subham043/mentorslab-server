import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ContentType } from './content_type.enum'

export class ContentCreateDto {
    @IsNotEmpty()
    @IsEnum(ContentType)
    type: ContentType;
    
    @IsString()
    @IsNotEmpty()
    file_path: string;
    
    @IsNotEmpty()
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
}