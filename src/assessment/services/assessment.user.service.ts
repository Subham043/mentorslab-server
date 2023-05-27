import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssessmentAnswerUserModifyDto,
  AssessmentUserGetDto,
  AssessmentUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { v4 as uuidV4 } from 'uuid';
import {
  createRazorpayOrder,
  verifyPayment,
} from 'src/common/hooks/razorpay.hooks';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AssessmentUserService {
  private readonly User = {
    id: true,
    name: true,
    email: true,
  };
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findAllPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<AssessmentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.assessment.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        AssessmentAssigned: {
          where: {
            requestedById: userId,
            currentQuestionAnswerAssigned: {
              draft: false,
            },
            OR: [
              {
                assignedRole: 'ASSIGNED',
              },
              {
                assignedRole: 'PURCHASED',
                PaymentInformation: {
                  some: {
                    status: 'PAID_FULL',
                  },
                },
              },
            ],
          },
          select: {
            requestedById: true,
            assignedRole: true,
            status: true,
            currentQuestionAnswerAssigned: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                draft: true,
              },
            },
            PaymentInformation: true,
          },
        },
      },
    });
    const count = await this.prisma.assessment.count({
      where: {
        draft: false,
      },
    });
    return {
      data,
      count,
    };
  }

  async findFreePaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<AssessmentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.assessment.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
        paid: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        AssessmentAssigned: {
          where: {
            requestedById: userId,
            OR: [
              {
                assignedRole: 'ASSIGNED',
              },
              {
                assignedRole: 'PURCHASED',
                PaymentInformation: {
                  some: {
                    status: 'PAID_FULL',
                  },
                },
              },
            ],
          },
          select: {
            requestedById: true,
            assignedRole: true,
            status: true,
            currentQuestionAnswerAssigned: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                draft: true,
              },
            },
            PaymentInformation: true,
          },
        },
      },
    });
    const count = await this.prisma.assessment.count({
      where: {
        draft: false,
        paid: false,
      },
    });
    return {
      data,
      count,
    };
  }

  async findPaidPaginate(
    params: {
      skip?: number;
      take?: number;
    },
    userId: number,
  ): Promise<AssessmentUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.assessment.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        id: 'desc',
      },
      where: {
        draft: false,
        paid: true,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        AssessmentAssigned: {
          where: {
            requestedById: userId,
            PaymentInformation: {
              some: {
                status: 'PAID_FULL',
              },
            },
          },
          select: {
            requestedById: true,
            assignedRole: true,
            status: true,
            currentQuestionAnswerAssigned: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                draft: true,
              },
            },
            PaymentInformation: true,
          },
        },
      },
    });
    const count = await this.prisma.assessment.count({
      where: {
        draft: false,
        paid: true,
      },
    });
    return {
      data,
      count,
    };
  }

  async findOne(
    id: string,
    userId: number,
  ): Promise<AssessmentUserGetDto | undefined> {
    const content = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        AssessmentAssigned: {
          where: {
            requestedById: userId,
            OR: [
              {
                assignedRole: 'ASSIGNED',
              },
              {
                assignedRole: 'PURCHASED',
                PaymentInformation: {
                  some: {
                    status: 'PAID_FULL',
                  },
                },
              },
            ],
          },
          select: {
            requestedById: true,
            assignedRole: true,
            status: true,
            reason: true,
            questionAnswerId: true,
            currentQuestionAnswerAssigned: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                draft: true,
              },
            },
            id: true,
            PaymentInformation: true,
          },
        },
      },
    });
    return content;
  }

  async findFile(id: string): Promise<AssessmentUserGetDto | undefined> {
    const content = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
    });
    return content;
  }

  async findOneWithPaymentOrder(
    id: string,
    userId: number,
  ): Promise<any | undefined> {
    const assessmentSecond = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        heading: true,
        description: true,
        draft: true,
        paid: true,
        amount: true,
        AssessmentAssigned: {
          where: {
            requestedById: userId,
            assignedRole: 'PURCHASED',
            PaymentInformation: {
              some: {
                status: 'PENDING',
              },
            },
          },
          select: {
            requestedById: true,
            assignedRole: true,
            status: true,
            PaymentInformation: {
              where: {
                paymentBy: userId,
              },
            },
          },
        },
        AssessmentQuestionAnswer: {
          take: 1,
          orderBy: {
            id: 'asc',
          },
          where: {
            draft: false,
          },
        },
      },
    });
    if (assessmentSecond.paid === false) return undefined;
    if (
      assessmentSecond.AssessmentQuestionAnswer &&
      assessmentSecond.AssessmentQuestionAnswer.length === 0
    )
      return undefined;
    if (
      assessmentSecond.AssessmentAssigned &&
      assessmentSecond.AssessmentAssigned.length === 0
    ) {
      const uuid = uuidV4();
      const order = await createRazorpayOrder(assessmentSecond.amount, uuid);
      const content = await this.prisma.assessment.findFirst({
        where: {
          uuid: id,
          draft: false,
        },
        select: {
          id: true,
          uuid: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          heading: true,
          description: true,
          paid: true,
          amount: true,
          AssessmentAssigned: {
            where: {
              requestedById: userId,
            },
            select: {
              requestedById: true,
            },
          },
          AssessmentQuestionAnswer: {
            take: 1,
            orderBy: {
              id: 'asc',
            },
            where: {
              draft: false,
            },
          },
        },
      });
      const assessment_assigned = await this.prisma.assessmentAssigned.create({
        data: {
          assessmentId: content.id,
          requestedById: userId,
          assignedRole: 'PURCHASED',
          questionAnswerId: content.AssessmentQuestionAnswer[0].id,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payment = await this.prisma.paymentAssessment.create({
        data: {
          orderId: order.id,
          amount: content.amount,
          receipt: order.receipt,
          paymentBy: userId,
          forAssessmentAssignedId: assessment_assigned.id,
        },
      });

      return order;
    } else if (
      assessmentSecond.AssessmentAssigned &&
      assessmentSecond.AssessmentAssigned.length !== 0 &&
      assessmentSecond.AssessmentAssigned[0].PaymentInformation[0].status ===
        'PENDING'
    ) {
      return {
        id: assessmentSecond.AssessmentAssigned[0].PaymentInformation[0]
          .orderId,
        amount:
          assessmentSecond.AssessmentAssigned[0].PaymentInformation[0].amount,
        currency: 'INR',
      };
    } else {
      return undefined;
    }
  }

  async verifyPaymentRecieved(
    dto: PaymentVerifyUserDto,
    userId: number,
  ): Promise<any | undefined> {
    const { razorpayOrderId, razorpayPaymentId, signature } = dto;
    const checkPayment = verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      signature,
    );
    if (!checkPayment) return undefined;
    const content = await this.prisma.paymentAssessment.update({
      where: { orderId: razorpayOrderId },
      data: {
        paymentReferenceId: razorpayPaymentId,
        status: 'PAID_FULL',
      },
    });
    const payment = await this.prisma.paymentAssessment.findFirst({
      where: {
        orderId: razorpayOrderId,
        id: content.id,
        paymentReferenceId: razorpayPaymentId,
        status: 'PAID_FULL',
      },
      select: {
        orderId: true,
        amount: true,
        paymentReferenceId: true,
        updatedAt: true,
        createdAt: true,
        paymentDoneBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        forAssessmentAssigned: {
          select: {
            assessment: {
              select: {
                id: true,
                uuid: true,
                name: true,
                heading: true,
              },
            },
          },
        },
      },
    });
    // this.mailService.paymentLiveSessionContent(payment);
    return content;
  }

  async requestSession(id: string, userId: number): Promise<string> {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
    });
    if (!assessment)
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const assessmentQuestionAnswer =
      await this.prisma.assessmentQuestionAnswer.findMany({
        take: 1,
        orderBy: {
          id: 'asc',
        },
        where: {
          draft: false,
          assessmentId: assessment.id,
        },
      });
    if (!assessmentQuestionAnswer || assessmentQuestionAnswer.length === 0)
      throw new HttpException(
        'Assessment questions are not ready yet. Please try again later!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessment.paid === false) {
      const assessmentAssigned = await this.prisma.assessmentAssigned.findFirst(
        {
          where: {
            assessmentId: assessment.id,
            requestedById: userId,
            assignedRole: 'ASSIGNED',
            status: 'ONGOING',
          },
        },
      );
      if (assessmentAssigned) {
        return 'Assessment already requested.';
      } else {
        const dta = await this.prisma.assessmentAssigned.create({
          data: {
            assessmentId: assessment.id,
            requestedById: userId,
            assignedRole: 'ASSIGNED',
            status: 'ONGOING',
            questionAnswerId: assessmentQuestionAnswer[0].id,
          },
        });
        // this.mailService.sessionRequested(dta);
        return 'Start Assessment.';
      }
    } else {
      const assessmentAssigned = await this.prisma.assessmentAssigned.findFirst(
        {
          where: {
            OR: [
              {
                assessmentId: assessment.id,
                requestedById: userId,
                assignedRole: 'PURCHASED',
                status: 'PENDING',
              },
              {
                assessmentId: assessment.id,
                requestedById: userId,
                assignedRole: 'PURCHASED',
                status: 'ONGOING',
              },
            ],
          },
        },
      );
      if (!assessmentAssigned)
        throw new HttpException(
          'Please make the payment first, then you start assessment',
          HttpStatus.BAD_REQUEST,
        );
      if (assessmentAssigned.status === 'ONGOING')
        return 'Assessment already requested.';
      await this.prisma.assessmentAssigned.updateMany({
        where: {
          assessmentId: assessment.id,
          requestedById: userId,
          assignedRole: 'PURCHASED',
          status: 'PENDING',
        },
        data: {
          status: 'ONGOING',
          questionAnswerId: assessmentQuestionAnswer[0].id,
        },
      });
      const liveSes2 = this.prisma.assessmentAssigned.findFirst({
        where: {
          assessmentId: assessment.id,
          requestedById: userId,
          assignedRole: 'PURCHASED',
          status: 'ONGOING',
        },
        select: {
          id: true,
          requestedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          assessment: {
            select: {
              id: true,
              uuid: true,
              name: true,
              heading: true,
            },
          },
        },
      });

      // this.mailService.sessionRequested(liveSes2);
      return 'Start Assessment.';
    }
  }

  async getAssessmentQuestion(id: string, userId: number): Promise<any> {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        paid: true,
        AssessmentQuestionAnswer: true,
      },
    });
    if (!assessment)
      throw new HttpException('Invalid Assessment ID', HttpStatus.BAD_REQUEST);
    if (assessment?.AssessmentQuestionAnswer.length === 0)
      throw new HttpException(
        'No Questions are ready for this assessment. Kindly try again later!',
        HttpStatus.BAD_REQUEST,
      );
    const assessmentAssigned = await this.prisma.assessmentAssigned.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        assessmentId: assessment.id,
        requestedById: userId,
      },
    });
    if (!assessmentAssigned || assessmentAssigned.length === 0)
      throw new HttpException(
        'Please apply for this assessment before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessment.paid === true && assessmentAssigned[0].status === 'PENDING')
      throw new HttpException(
        'Please apply for this assessment before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessmentAssigned[0].status === 'COMPLETED')
      return {
        assessment_status: 'COMPLETED',
        status: false,
        message: 'You have completed your assessment successfully!',
      };
    const assessmentQuestionAnswer =
      await this.prisma.assessmentQuestionAnswer.findFirst({
        orderBy: {
          id: 'asc',
        },
        where: {
          draft: false,
          assessmentId: assessment.id,
          id: assessmentAssigned[0].questionAnswerId,
        },
        select: {
          id: true,
          uuid: true,
          question: true,
          answer_a: true,
          answer_a_choice_id: true,
          answer_b: true,
          answer_b_choice_id: true,
          answer_c: true,
          answer_c_choice_id: true,
          answer_d: true,
          answer_d_choice_id: true,
          image: true,
        },
      });
    const totalQuestion = await this.prisma.assessmentQuestionAnswer.count({
      where: {
        assessmentId: assessment.id,
      },
    });
    const currentQuestion = await this.prisma.assessmentSelectedAnswer.count({
      where: {
        assessmentId: assessment.id,
        attendedById: userId,
      },
    });
    return {
      assessment_status: 'ONGOING',
      status: true,
      sets: assessmentQuestionAnswer,
      totalQuestion,
      currentQuestion: currentQuestion + 1,
    };
  }

  async postAssessmentQuestionAnswer(
    id: string,
    userId: number,
    answer: AssessmentAnswerUserModifyDto,
  ): Promise<any> {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        paid: true,
        AssessmentQuestionAnswer: true,
      },
    });
    if (!assessment)
      throw new HttpException('Invalid Assessment ID', HttpStatus.BAD_REQUEST);
    if (assessment?.AssessmentQuestionAnswer.length === 0)
      throw new HttpException(
        'No Questions are ready for this assessment. Kindly try again later!',
        HttpStatus.BAD_REQUEST,
      );
    const assessmentAssigned = await this.prisma.assessmentAssigned.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        assessmentId: assessment.id,
        requestedById: userId,
      },
      select: {
        status: true,
        reason: true,
        questionAnswerId: true,
        id: true,
        currentQuestionAnswerAssigned: true,
      },
    });
    if (!assessmentAssigned || assessmentAssigned.length === 0)
      throw new HttpException(
        'Please apply for this assessment before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessment.paid === true && assessmentAssigned[0].status === 'PENDING')
      throw new HttpException(
        'Please apply for this assessment before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessmentAssigned[0].status === 'COMPLETED')
      return {
        assessment_status: 'COMPLETED',
        status: false,
        message: 'You have completed your assessment successfully!',
      };
    if (answer.status === 'ONGOING') {
      await this.prisma.assessmentSelectedAnswer.create({
        data: {
          assessmentId: assessment.id,
          attendedById: userId,
          assessmentAssignedId: assessmentAssigned[0].id,
          currentQuestionAnswerId: assessmentAssigned[0].questionAnswerId,
          selected_answer_id: Number(answer.selected_answer_id),
        },
      });
      const totalAnswered = await this.prisma.assessmentSelectedAnswer.count({
        where: {
          assessmentId: assessment.id,
          attendedById: userId,
        },
      });
      const qA = await this.prisma.assessmentQuestionAnswer.findMany({
        skip: totalAnswered,
        take: 1,
        orderBy: {
          id: 'asc',
        },
        where: {
          draft: false,
          assessmentId: assessment.id,
        },
      });
      if (qA.length > 0) {
        await this.prisma.assessmentAssigned.update({
          where: { id: Number(assessmentAssigned[0].id) },
          data: {
            status: 'ONGOING',
            questionAnswerId: qA[0].id,
          },
        });
        return {
          assessment_status: 'ONGOING',
          status: true,
          message: 'Answer submitted successfully',
        };
      } else {
        await this.prisma.assessmentAssigned.update({
          where: { id: Number(assessmentAssigned[0].id) },
          data: {
            status: 'COMPLETED',
          },
        });
        return {
          assessment_status: 'COMPLETED',
          status: false,
          message: 'You have completed your assessment successfully!',
        };
      }
    }
  }

  async getAssessmentReport(
    params: {
      skip?: number;
      take?: number;
    },
    id: string,
    userId: number,
  ): Promise<any> {
    const { skip, take } = params;
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        paid: true,
        AssessmentCategory: true,
        AssessmentQuestionAnswer: true,
      },
    });
    if (!assessment)
      throw new HttpException('Invalid Assessment ID', HttpStatus.BAD_REQUEST);
    if (assessment?.AssessmentQuestionAnswer.length === 0)
      throw new HttpException(
        'No Questions are ready for this assessment. Kindly try again later!',
        HttpStatus.BAD_REQUEST,
      );
    const assessmentAssigned = await this.prisma.assessmentAssigned.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        assessmentId: assessment.id,
        requestedById: userId,
      },
    });
    if (!assessmentAssigned || assessmentAssigned.length === 0)
      throw new HttpException(
        'Please apply for this assessment before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessment.paid === true && assessmentAssigned[0].status === 'PENDING')
      throw new HttpException(
        'Please apply for this assessment before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (assessmentAssigned[0].status === 'ONGOING')
      throw new HttpException(
        'The assessment is currently in progress therefore you cannot view result of this assessment!',
        HttpStatus.BAD_REQUEST,
      );
    const sA = await this.prisma.assessmentSelectedAnswer.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        assessmentId: assessment.id,
        attendedById: userId,
      },
    });
    let qA = null;
    if (sA.length > 0)
      qA = await this.prisma.assessmentQuestionAnswer.findFirst({
        orderBy: {
          id: 'asc',
        },
        where: {
          id: sA[0].currentQuestionAnswerId,
        },
        select: {
          answer_a: true,
          answer_a_choice: true,
          answer_a_choice_id: true,
          answer_b: true,
          answer_b_choice_id: true,
          answer_b_choice: true,
          answer_c: true,
          answer_c_choice_id: true,
          answer_c_choice: true,
          answer_d: true,
          answer_d_choice: true,
          answer_d_choice_id: true,
          assessmentId: true,
          createdAt: true,
          draft: true,
          id: true,
          image: true,
          updatedAt: true,
          question: true,
          uploadBy: true,
          uuid: true,
        },
      });
    const count = await this.prisma.assessmentSelectedAnswer.count({
      where: {
        assessmentId: assessment.id,
        attendedById: userId,
      },
    });
    const total_questions = await this.prisma.assessmentQuestionAnswer.count({
      where: {
        assessmentId: assessment.id,
      },
    });
    const attempted = await this.prisma.assessmentSelectedAnswer.count({
      where: {
        assessmentId: assessment.id,
        attendedById: userId,
        NOT: {
          selected_answer: null,
        },
      },
    });
    const main_report = [];
    if (assessment?.AssessmentCategory?.length > 0) {
      for (
        let index = 0;
        index < assessment?.AssessmentCategory?.length;
        index++
      ) {
        const point = await this.prisma.assessmentSelectedAnswer.count({
          where: {
            assessmentId: assessment.id,
            attendedById: userId,
            selected_answer_id: assessment?.AssessmentCategory[index].id,
            NOT: {
              selected_answer: null,
            },
          },
        });
        main_report.push({
          ...assessment?.AssessmentCategory[index],
          point,
        });
      }
    }
    return {
      data: sA,
      questionSet: qA,
      total_questions,
      attempted,
      main_report,
      count,
    };
  }
}
