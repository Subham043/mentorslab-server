export interface AssessmentQuestionAnswerAdminGetDto {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  question?: string;
  answer_a?: string;
  answer_a_choice_id?: number;
  answer_b?: string;
  answer_b_choice_id?: number;
  answer_c?: string;
  answer_c_choice_id?: number;
  answer_d?: string;
  answer_d_choice_id?: number;
  image?: string;
}
