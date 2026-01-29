export class CreatePreferenceDto {
  items:{
      id: string,
      title: string,
      description?: string,
      picture_url?: string,
      category_id?: string,
      quantity: number,
      currency_id?: string,
      unit_price: number
    }[]
  payer: {
    name: string,
    surname: string,
    email: string,
    phone: {
      area_code: string,
      number: number
    },
    identification: {
      type: string,
      number: string
    },
    address: {
      zip_code: string,
      street_name: string,
      street_number: number
    },
    registration_date: string
  }
  notification_url: string
  auto_return: string
  expires: boolean
  external_reference: string

  constructor(id: number, cpf: string, amount: number){
    this.items = [
      {
        id: '1',
        title: 'Placeholder',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: amount
      }
    ]
    this.notification_url = `${process.env.WEBHOOK_URL}`
    this.expires = false
    this.external_reference = id.toString()
  }
}

