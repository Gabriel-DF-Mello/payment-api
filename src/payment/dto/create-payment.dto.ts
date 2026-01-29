import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { IsCPF } from 'class-validator-cpf'
import { Constants } from 'src/constants'




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
  @IsIn(Constants.ALLOWED_PAYMENTS, { message: 'Payment must be PIX or CREDIT CARD' })
  paymentMethod: string
}

