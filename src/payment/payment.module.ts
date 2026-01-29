import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MercadoPagoModule } from 'src/mercado-pago/mercado-pago.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports:[MercadoPagoModule],
})
export class PaymentModule {}
