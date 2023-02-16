import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
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

  async requestSession(id: string, userId: number): Promise<any> {
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
}
