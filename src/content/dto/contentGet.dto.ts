export interface ContentGetDto {
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
    type: string;
    file_path: string;
    heading: string;
    description: string;
    draft: boolean;
    restricted: boolean;
}