export interface UserGetDto {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  verified?: boolean;
  blocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
