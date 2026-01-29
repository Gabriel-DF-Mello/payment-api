import { Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client'
import { CreatePaymentDto, FindPaymentsDto, UpdatePaymentDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor (private prisma: PrismaService) {}

  async createPayment(dto: CreatePaymentDto){
    console.log({
      dto,
    })

    const payment = await this.prisma.payment.create({
      data: {
        cpf: dto.cpf,
        description: dto.description,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        status: 'PENDING'
      }
    })

    return payment
  }

  async updatePayment(id: number, dto: UpdatePaymentDto){
    console.log({
      id,
      dto,
    })

    const payment = await this.prisma.payment.update({
      where: {
        id,
      },
      data: {
        ...dto
      }
    });

    return payment
  }

  async getPaymentById(id: number){
    console.log({
      id,
    })
    return this.prisma.payment.findUnique({
      where: {id: id},
    });
  }

  async getPayments(dto: FindPaymentsDto){
    const payments = await this.prisma.payment.findMany({
      where: {
        cpf: dto.cpf,
        description:{
          contains: dto.description
        },
        paymentMethod: dto.paymentMethod,
        status: dto.status
      },
    }); 

    return payments
  }
}
