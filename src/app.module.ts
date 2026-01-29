import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PaymentModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }),],
})
export class AppModule {}
