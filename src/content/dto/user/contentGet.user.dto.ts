export interface ContentUserGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  type?: string;
  name?: string;
  file_path?: string;
  heading?: string;
  description?: string;
  draft?: boolean;
  restricted?: boolean;
  paid?: boolean;
}
