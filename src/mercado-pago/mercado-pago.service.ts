import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreatePreferenceDto } from './dto';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class MercadoPagoService {
  constructor(private config: ConfigService, private readonly httpService: HttpService) {}

  async createPreference(id: number, cpf: string, amount: number) {
    const preference = new CreatePreferenceDto(id, cpf, amount)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.get('MERCADO_PAGO_TOKEN')}`,
    }

    const response = await firstValueFrom(
      this.httpService.post(`${this.config.get('MERCADO_PAGO_URL')}/checkout/preferences`, preference, {headers: headers}).pipe(
        map((response: AxiosResponse) => {
          return {
            status: response.status,
            data: response.data
          }
        }),
      )
    )
    return response
  }

  async getPayment(id: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.get('MERCADO_PAGO_TOKEN')}`,
    }

    const response = await firstValueFrom(
      this.httpService.get(`${this.config.get('MERCADO_PAGO_URL')}/v1/payments/${id}`, {headers: headers}).pipe(
        map((response: AxiosResponse) => {
          return {
            status: response.status,
            data: response.data
          }
        }),
      )
    )
    return response
  }
}
