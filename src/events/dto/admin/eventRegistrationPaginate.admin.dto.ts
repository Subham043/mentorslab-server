interface EventRegistrationAdminGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  receipt?: string;
  orderId?: string;
  paymentReferenceId?: string;
  event?: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    url?: string;
    title?: string;
    amount?: string;
    paid?: boolean;
  };
}

export interface EventRegistrationAdminPaginateDto {
  count: number;
  data: EventRegistrationAdminGetDto[];
}
