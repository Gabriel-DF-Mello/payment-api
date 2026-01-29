export abstract class Constants {
  static readonly PIX = 'PIX'
  static readonly CREDIT_CARD = 'CREDIT_CARD'
  static readonly PENDING = 'PENDING'
  static readonly PAID = 'PAID'
  static readonly FAIL = 'FAIL'
  static readonly ALLOWED_PAYMENTS = [this.PIX, this.CREDIT_CARD]
  static readonly ALLOWED_STATUSES = [this.PENDING, this.FAIL, this.PAID]
  static readonly FAIL_STATUSES = [400, 401, 500]
}