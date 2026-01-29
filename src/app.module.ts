import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';

@Module({
  imports: [
    PaymentModule, 
    PrismaModule, 
    ConfigModule.forRoot({ isGlobal: true }), 
    MercadoPagoModule
  ],
})
export class AppModule {}
