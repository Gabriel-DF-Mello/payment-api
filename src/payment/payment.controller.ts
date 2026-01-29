import { Controller, Get, Param, ParseIntPipe, Post, Patch, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, FindPaymentsDto, NotifyPaymentDto, UpdatePaymentDto } from './dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService ) {}

  @Post()
  createPayment(@Body() dto: CreatePaymentDto){
    return this.paymentService.createPayment(dto)
  }

  @Post('notify')
  notifyPayment(@Body() dto: any){
    return this.paymentService.notifyPayment(dto)
  }

  @Patch(':id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto
  ){
    return this.paymentService.updatePayment(id, dto)
  }

  @Get()
  getPayments(
    @Body() dto: FindPaymentsDto
  ){
    return this.paymentService.getPayments(dto)
  } 

  @Get(':id')
  getPaymentById(
     @Param('id', ParseIntPipe) id: number,
  ){
    return this.paymentService.getPaymentById(id)
  }
}
