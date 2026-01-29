import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { IsCPF } from 'class-validator-cpf'
import { allowedPayments, allowedStatuses } from 'src/constants'

export class UpdatePaymentDto {
  @IsCPF()
  @IsOptional()
  cpf: string
  @IsString()
  @IsOptional()
  description: string
  @IsNumber({maxDecimalPlaces: 2})
  @IsOptional()
  amount: number
  @IsString()
  @IsIn(allowedPayments, { message: 'Payment must be PIX or CREDIT CARD' })
  @IsOptional()
  paymentMethod: string
  @IsString()
  @IsIn(allowedStatuses, {message: 'Status must be PENDING, PAID, or FAIL'})
  @IsOptional()
  status: string
}

