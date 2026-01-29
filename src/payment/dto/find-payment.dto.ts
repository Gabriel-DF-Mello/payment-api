import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { IsCPF } from 'class-validator-cpf'
import { Constants } from 'src/constants'

export class FindPaymentsDto {
  @IsCPF()
  @IsOptional()
  cpf: string
  @IsString()
  @IsOptional()
  description: string
  @IsString()
  @IsIn(Constants.ALLOWED_PAYMENTS, { message: 'Payment must be PIX or CREDIT CARD' })
  @IsOptional()
  paymentMethod: string
  @IsString()
  @IsIn(Constants.ALLOWED_STATUSES, {message: 'Status must be PENDING, PAID, or FAIL'})
  @IsOptional()
  status: string
}

