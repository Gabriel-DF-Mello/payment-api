import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Payment } from '@prisma/client'
import { CreatePaymentDto, FindPaymentsDto, UpdatePaymentDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Constants } from 'src/constants';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { constants } from 'buffer';

@Injectable()
export class PaymentService {
  constructor (private prisma: PrismaService, private mercadoPago: MercadoPagoService) {}

  async createPayment(dto: CreatePaymentDto){
    console.log({
      dto,
    })

     const payment = await this.prisma.$transaction(async (transaction) => {
      let pending = await transaction.payment.create({
        data: {
          cpf: dto.cpf,
          description: dto.description,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          status: Constants.PENDING
        }
      })

      if(dto.paymentMethod == Constants.CREDIT_CARD){
        const preference = await this.mercadoPago.createPreference(pending.id, pending.cpf, pending.amount.toNumber())

        if (preference.status == HttpStatus.BAD_REQUEST || preference.status == HttpStatus.INTERNAL_SERVER_ERROR){
          pending = await transaction.payment.update({
            data: {
              status: Constants.FAIL
            },
            where: {
              id: pending.id
            }
          })
        }
      }

      return pending
    })
    if(payment.status == Constants.FAIL) {
      throw new HttpException('Payment Failed', HttpStatus.BAD_REQUEST)
    }

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

  async notifyPayment(dto: any){
    console.log(dto)
  }
}
