export interface ExamQuestionAnswerAdminGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  question?: string;
  answer_a?: string;
  answer_b?: string;
  answer_c?: string;
  answer_d?: string;
  correct_answer?: string;
  duration?: number;
  marks?: number;
  image?: string;
}
