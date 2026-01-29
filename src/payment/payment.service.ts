import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '@prisma/client'
import { CreatePaymentDto, FindPaymentsDto, NotifyPaymentDto, UpdatePaymentDto } from './dto';
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

     const [payment, preference] = await this.prisma.$transaction(async (transaction) => {
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
        try{
          const preference = await this.mercadoPago.createPreference(pending.id, pending.cpf, pending.amount.toNumber())
          console.log({preference})

          return [pending, preference]

        } catch (error){
          console.log(error)

          pending = await transaction.payment.update({
            data: {
              status: Constants.FAIL
            },
            where: {
              id: pending.id
            }
          })

          return [pending, null]
        }
      }

      return [pending, null]
    })
    if(payment.status == Constants.FAIL) {
      throw new HttpException('Payment Failed', HttpStatus.BAD_REQUEST)
    }

    return {payment, preference}
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

    let status = Constants.PENDING
    //Receive a payment action, get data id
    if(dto.type != Constants.MP_TYPE_PAYMENT){
      return true
    }

    try {
      // Get payment via id from mercado-pago API
      let payment = await this.mercadoPago.getPayment(dto.data.id)
      console.log(payment)

      if(!payment.data.external_reference){
        throw new NotFoundException('Payment missing external reference');
      }

      // if payment status is approved, update to PAID
      if(payment.data.status in Constants.MP_STATUS_PAID){
        status = Constants.PAID
      // if payment is pending, authorized, in_process or in_mediation, update to PENDING
      } else if (payment.data.status in Constants.MP_STATUS_PENDING){
        status = Constants.PENDING
      // if payment is rejected, cancelled, refunded or charged_back, update to FAIL
      } else {
        status = Constants.FAIL
      }

      await this.prisma.payment.update({
        where: {
          id: payment.data.external_reference,
        },
        data: {
          status: status
        }
      });

      return true
    } catch (error) {
      console.log(error)
      throw new HttpException('Payment could not be processed', HttpStatus.BAD_REQUEST)
    }
  }
}
