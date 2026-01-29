import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { IsCPF } from 'class-validator-cpf'
import { allowedPayments } from 'src/constants'



export class CreatePaymentDto {
  @IsNotEmpty()
  @IsCPF()
  cpf: string
  @IsString()
  @IsOptional()
  description: string
  @IsNotEmpty()
  @IsNumber({maxDecimalPlaces: 2})
  amount: number
  @IsNotEmpty()
  @IsString()
  @IsIn(allowedPayments, { message: 'Payment must be PIX or CREDIT CARD' })
  paymentMethod: string
}

