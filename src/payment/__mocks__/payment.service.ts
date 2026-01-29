import { paymentStub } from '../test/stubs/payment.stub';

export const PaymentService = jest.fn().mockReturnValue({
  getPayments: jest.fn().mockReturnValue([paymentStub()]),
  getPaymentById: jest.fn().mockReturnValue(paymentStub()),
  createPayment: jest.fn().mockReturnValue({payment: paymentStub(), preference: {}}),
  updatePayment: jest.fn().mockReturnValue(paymentStub()),
  notifyPayment: jest.fn().mockReturnValue(paymentStub()),
});
