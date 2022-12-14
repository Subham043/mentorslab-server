export interface EventUserGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  url?: string;
  title?: string;
  from_date?: string;
  to_date?: string;
  time?: string;
  amount?: string;
  banner?: string;
  video?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  draft?: boolean;
  paid?: boolean;
}
