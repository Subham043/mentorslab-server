import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExamAnswerUserModifyDto,
  ExamUserGetDto,
  ExamUserPaginateDto,
  PaymentVerifyUserDto,
} from '../dto';
import { v4 as uuidV4 } from 'uuid';
import {
  createRazorpayOrder,
  verifyPayment,
} from 'src/common/hooks/razorpay.hooks';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ExamUserService {
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
  ): Promise<ExamUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
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
        ExamAssigned: {
          where: {
            requestedById: userId,
            currentQuestionAnswer: {
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
            currentQuestionAnswer: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                marks: true,
                duration: true,
                draft: true,
              },
            },
            PaymentInformation: true,
          },
        },
      },
    });
    const count = await this.prisma.exam.count({
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
  ): Promise<ExamUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
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
        ExamAssigned: {
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
            currentQuestionAnswer: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                marks: true,
                duration: true,
                draft: true,
              },
            },
            PaymentInformation: true,
          },
        },
      },
    });
    const count = await this.prisma.exam.count({
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
  ): Promise<ExamUserPaginateDto> {
    const { skip, take } = params;
    const data = await this.prisma.exam.findMany({
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
        ExamAssigned: {
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
            currentQuestionAnswer: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                marks: true,
                duration: true,
                draft: true,
              },
            },
            PaymentInformation: true,
          },
        },
      },
    });
    const count = await this.prisma.exam.count({
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
  ): Promise<ExamUserGetDto | undefined> {
    const content = await this.prisma.exam.findFirst({
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
        ExamAssigned: {
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
            currentQuestionAnswer: {
              select: {
                uuid: true,
                question: true,
                image: true,
                answer_a: true,
                answer_b: true,
                answer_c: true,
                answer_d: true,
                marks: true,
                duration: true,
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

  async findFile(id: string): Promise<ExamUserGetDto | undefined> {
    const content = await this.prisma.exam.findFirst({
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
    const examSecond = await this.prisma.exam.findFirst({
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
        ExamAssigned: {
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
        ExamQuestionAnswer: {
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
    if (examSecond.paid === false) return undefined;
    if (
      examSecond.ExamQuestionAnswer &&
      examSecond.ExamQuestionAnswer.length === 0
    )
      return undefined;
    if (examSecond.ExamAssigned && examSecond.ExamAssigned.length === 0) {
      const uuid = uuidV4();
      const order = await createRazorpayOrder(examSecond.amount, uuid);
      const content = await this.prisma.exam.findFirst({
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
          ExamAssigned: {
            where: {
              requestedById: userId,
            },
            select: {
              requestedById: true,
            },
          },
          ExamQuestionAnswer: {
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
      const exam_assigned = await this.prisma.examAssigned.create({
        data: {
          examId: content.id,
          requestedById: userId,
          assignedRole: 'PURCHASED',
          questionAnswerId: content.ExamQuestionAnswer[0].id,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payment = await this.prisma.paymentExam.create({
        data: {
          orderId: order.id,
          amount: content.amount,
          receipt: order.receipt,
          paymentBy: userId,
          forExamAssignedId: exam_assigned.id,
        },
      });

      return order;
    } else if (
      examSecond.ExamAssigned &&
      examSecond.ExamAssigned.length !== 0 &&
      examSecond.ExamAssigned[0].PaymentInformation[0].status === 'PENDING'
    ) {
      return {
        id: examSecond.ExamAssigned[0].PaymentInformation[0].orderId,
        amount: examSecond.ExamAssigned[0].PaymentInformation[0].amount,
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
    const content = await this.prisma.paymentExam.update({
      where: { orderId: razorpayOrderId },
      data: {
        paymentReferenceId: razorpayPaymentId,
        status: 'PAID_FULL',
      },
    });
    const payment = await this.prisma.paymentExam.findFirst({
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
        forExamAssigned: {
          select: {
            exam: {
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
    const exam = await this.prisma.exam.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
    });
    if (!exam) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const examQuestionAnswer = await this.prisma.examQuestionAnswer.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        draft: false,
        examId: exam.id,
      },
    });
    if (!examQuestionAnswer || examQuestionAnswer.length === 0)
      throw new HttpException(
        'Exam questions are not ready yet. Please try again later!',
        HttpStatus.BAD_REQUEST,
      );
    if (exam.paid === false) {
      const examAssigned = await this.prisma.examAssigned.findFirst({
        where: {
          examId: exam.id,
          requestedById: userId,
          assignedRole: 'ASSIGNED',
          status: 'ONGOING',
        },
      });
      if (examAssigned) {
        return 'Exam already requested.';
      } else {
        const dta = await this.prisma.examAssigned.create({
          data: {
            examId: exam.id,
            requestedById: userId,
            assignedRole: 'ASSIGNED',
            status: 'ONGOING',
            questionAnswerId: examQuestionAnswer[0].id,
          },
        });
        // this.mailService.sessionRequested(dta);
        return 'Start Exam.';
      }
    } else {
      const examAssigned = await this.prisma.examAssigned.findFirst({
        where: {
          OR: [
            {
              examId: exam.id,
              requestedById: userId,
              assignedRole: 'PURCHASED',
              status: 'PENDING',
            },
            {
              examId: exam.id,
              requestedById: userId,
              assignedRole: 'PURCHASED',
              status: 'ONGOING',
            },
          ],
        },
      });
      if (!examAssigned)
        throw new HttpException(
          'Please make the payment first, then you start exam',
          HttpStatus.BAD_REQUEST,
        );
      if (examAssigned.status === 'ONGOING') return 'Exam already requested.';
      await this.prisma.examAssigned.updateMany({
        where: {
          examId: exam.id,
          requestedById: userId,
          assignedRole: 'PURCHASED',
          status: 'PENDING',
        },
        data: {
          status: 'ONGOING',
          questionAnswerId: examQuestionAnswer[0].id,
        },
      });
      const liveSes2 = this.prisma.examAssigned.findFirst({
        where: {
          examId: exam.id,
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
          exam: {
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
      return 'Start Exam.';
    }
  }

  async getExamQuestion(id: string, userId: number): Promise<any> {
    const exam = await this.prisma.exam.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        paid: true,
        ExamQuestionAnswer: true,
      },
    });
    if (!exam)
      throw new HttpException('Invalid Exam ID', HttpStatus.BAD_REQUEST);
    if (exam?.ExamQuestionAnswer.length === 0)
      throw new HttpException(
        'No Questions are ready for this exam. Kindly try again later!',
        HttpStatus.BAD_REQUEST,
      );
    const examAssigned = await this.prisma.examAssigned.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        examId: exam.id,
        requestedById: userId,
      },
    });
    if (!examAssigned || examAssigned.length === 0)
      throw new HttpException(
        'Please apply for this exam before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (exam.paid === true && examAssigned[0].status === 'PENDING')
      throw new HttpException(
        'Please apply for this exam before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (examAssigned[0].status === 'COMPLETED')
      return {
        exam_status: 'COMPLETED',
        status: false,
        message: 'You have completed your exam successfully!',
      };
    if (examAssigned[0].status === 'ABORTED')
      return {
        exam_status: 'ABORTED',
        status: false,
        message:
          'You have been barred from giving this exam because ' +
          examAssigned[0].reason,
      };
    const examQuestionAnswer = await this.prisma.examQuestionAnswer.findFirst({
      orderBy: {
        id: 'asc',
      },
      where: {
        draft: false,
        examId: exam.id,
        id: examAssigned[0].questionAnswerId,
      },
      select: {
        id: true,
        uuid: true,
        question: true,
        answer_a: true,
        answer_b: true,
        answer_c: true,
        answer_d: true,
        image: true,
        marks: true,
        duration: true,
      },
    });
    const totalQuestion = await this.prisma.examQuestionAnswer.count({
      where: {
        examId: exam.id,
      },
    });
    const currentQuestion = await this.prisma.examSelectedAnswer.count({
      where: {
        examId: exam.id,
        attendedById: userId,
      },
    });
    return {
      exam_status: 'ONGOING',
      status: true,
      sets: examQuestionAnswer,
      totalQuestion,
      currentQuestion: currentQuestion + 1,
    };
  }

  async postExamQuestionAnswer(
    id: string,
    userId: number,
    answer: ExamAnswerUserModifyDto,
  ): Promise<any> {
    const exam = await this.prisma.exam.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        paid: true,
        ExamQuestionAnswer: true,
      },
    });
    if (!exam)
      throw new HttpException('Invalid Exam ID', HttpStatus.BAD_REQUEST);
    if (exam?.ExamQuestionAnswer.length === 0)
      throw new HttpException(
        'No Questions are ready for this exam. Kindly try again later!',
        HttpStatus.BAD_REQUEST,
      );
    const examAssigned = await this.prisma.examAssigned.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        examId: exam.id,
        requestedById: userId,
      },
      select: {
        status: true,
        reason: true,
        questionAnswerId: true,
        id: true,
        currentQuestionAnswer: true,
      },
    });
    if (!examAssigned || examAssigned.length === 0)
      throw new HttpException(
        'Please apply for this exam before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (exam.paid === true && examAssigned[0].status === 'PENDING')
      throw new HttpException(
        'Please apply for this exam before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (examAssigned[0].status === 'COMPLETED')
      return {
        exam_status: 'COMPLETED',
        status: false,
        message: 'You have completed your exam successfully!',
      };
    if (examAssigned[0].status === 'ABORTED')
      return {
        exam_status: 'ABORTED',
        status: false,
        message:
          'You have been barred from giving this exam because ' +
          examAssigned[0].reason,
      };
    if (answer.status === 'ABORTED') {
      await this.prisma.examAssigned.update({
        where: { id: Number(examAssigned[0].id) },
        data: {
          status: 'ABORTED',
          reason: answer.reason,
        },
      });
      return {
        exam_status: 'ABORTED',
        status: false,
        message:
          'You have been barred from giving this exam because ' + answer.reason,
      };
    }
    if (answer.status === 'ONGOING') {
      await this.prisma.examSelectedAnswer.create({
        data: {
          examId: exam.id,
          attendedById: userId,
          examAssignedId: examAssigned[0].id,
          currentQuestionAnswerId: examAssigned[0].questionAnswerId,
          selected_answer: answer.selected_answer
            ? answer.selected_answer
            : null,
          correct_answer: examAssigned[0].currentQuestionAnswer.correct_answer,
          marks:
            answer.selected_answer ===
            examAssigned[0].currentQuestionAnswer.correct_answer
              ? examAssigned[0].currentQuestionAnswer.marks
              : 0,
        },
      });
      const totalAnswered = await this.prisma.examSelectedAnswer.count({
        where: {
          examId: exam.id,
          attendedById: userId,
        },
      });
      const qA = await this.prisma.examQuestionAnswer.findMany({
        skip: totalAnswered,
        take: 1,
        orderBy: {
          id: 'asc',
        },
        where: {
          draft: false,
          examId: exam.id,
        },
      });
      if (qA.length > 0) {
        await this.prisma.examAssigned.update({
          where: { id: Number(examAssigned[0].id) },
          data: {
            status: 'ONGOING',
            questionAnswerId: qA[0].id,
          },
        });
        return {
          exam_status: 'ONGOING',
          status: true,
          message: 'Answer submitted successfully',
        };
      } else {
        await this.prisma.examAssigned.update({
          where: { id: Number(examAssigned[0].id) },
          data: {
            status: 'COMPLETED',
          },
        });
        return {
          exam_status: 'COMPLETED',
          status: false,
          message: 'You have completed your exam successfully!',
        };
      }
    }
  }

  async getExamReport(
    params: {
      skip?: number;
      take?: number;
    },
    id: string,
    userId: number,
  ): Promise<any> {
    const { skip, take } = params;
    const exam = await this.prisma.exam.findFirst({
      where: {
        uuid: id,
        draft: false,
      },
      select: {
        id: true,
        paid: true,
        ExamQuestionAnswer: true,
      },
    });
    if (!exam)
      throw new HttpException('Invalid Exam ID', HttpStatus.BAD_REQUEST);
    if (exam?.ExamQuestionAnswer.length === 0)
      throw new HttpException(
        'No Questions are ready for this exam. Kindly try again later!',
        HttpStatus.BAD_REQUEST,
      );
    const examAssigned = await this.prisma.examAssigned.findMany({
      take: 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        examId: exam.id,
        requestedById: userId,
      },
    });
    if (!examAssigned || examAssigned.length === 0)
      throw new HttpException(
        'Please apply for this exam before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (exam.paid === true && examAssigned[0].status === 'PENDING')
      throw new HttpException(
        'Please apply for this exam before you can appear for it!',
        HttpStatus.BAD_REQUEST,
      );
    if (examAssigned[0].status === 'ABORTED')
      throw new HttpException(
        'You had been barred from giving this exam because ' +
          examAssigned[0].reason +
          ', therefore you cannot view result of this exam!',
        HttpStatus.BAD_REQUEST,
      );
    if (examAssigned[0].status === 'ONGOING')
      throw new HttpException(
        'The exam is currently in progress therefore you cannot view result of this exam!',
        HttpStatus.BAD_REQUEST,
      );
    const sA = await this.prisma.examSelectedAnswer.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 1,
      orderBy: {
        id: 'asc',
      },
      where: {
        examId: exam.id,
        attendedById: userId,
      },
    });
    let qA = null;
    if (sA.length > 0)
      qA = await this.prisma.examQuestionAnswer.findFirst({
        orderBy: {
          id: 'asc',
        },
        where: {
          id: sA[0].currentQuestionAnswerId,
        },
      });
    const count = await this.prisma.examSelectedAnswer.count({
      where: {
        examId: exam.id,
        attendedById: userId,
      },
    });
    const total_questions = await this.prisma.examQuestionAnswer.count({
      where: {
        examId: exam.id,
      },
    });
    const attempted = await this.prisma.examSelectedAnswer.count({
      where: {
        examId: exam.id,
        attendedById: userId,
        NOT: {
          selected_answer: null,
        },
      },
    });
    const total_marks = await this.prisma.examQuestionAnswer.aggregate({
      _sum: {
        marks: true,
      },
      where: {
        examId: exam.id,
      },
    });
    const marks_alloted = await this.prisma.examSelectedAnswer.aggregate({
      _sum: {
        marks: true,
      },
      where: {
        examId: exam.id,
        attendedById: userId,
      },
    });
    const percentage =
      (marks_alloted._sum.marks / total_marks._sum.marks) * 100;
    return {
      data: sA,
      questionSet: qA,
      total_questions,
      attempted,
      total_marks: total_marks._sum.marks,
      marks_alloted: marks_alloted._sum.marks,
      percentage,
      count,
    };
  }
}
