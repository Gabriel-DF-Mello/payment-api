/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { PaymentController } from '../payment.controller';
import { PaymentService } from '../payment.service';
import { CreatePaymentDto, UpdatePaymentDto, FindPaymentsDto, NotifyPaymentDto } from '../dto';
import { paymentStub } from './stubs/payment.stub';
import { Payment } from '@prisma/client';
import { Constants } from 'src/constants';

jest.mock('../payment.service');
jest.mock('../../mercado-pago/mercado-pago.service')

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();

    paymentController = moduleRef.get<PaymentController>(PaymentController);
    paymentService = moduleRef.get<PaymentService>(PaymentService);
    jest.clearAllMocks();
  });

  describe('getPayments', () => {
    describe('when getPayments is called', () => {
      let payments: Payment[];
      let findPaymentsDto: FindPaymentsDto;

      beforeEach(async () => {
        findPaymentsDto = {
          cpf: '19119119100',
          paymentMethod: Constants.PIX,
          status: Constants.PENDING
        };
        payments = await paymentController.getPayments(findPaymentsDto);
      });

      test('then it should call paymentService.getPayments', () => {
        expect(paymentService.getPayments).toHaveBeenCalledWith(findPaymentsDto);
      });

      test('then is should return payments', () => {
        expect(payments).toEqual([paymentStub()]);
      });
    });
  });

  describe('getPaymentById', () => {
    describe('when getPaymentById is called', () => {
      let payment: Payment | null;

      beforeEach(async () => {
        payment = await paymentController.getPaymentById(paymentStub().id);
      });

      test('then it should call paymentService.getPaymentById', () => {
        expect(paymentService.getPaymentById).toHaveBeenCalledWith(
          paymentStub().id
        );
      });

      test('then is should return a payment', () => {
        expect(payment).toEqual(paymentStub());
      });
    });
  });

  describe('createPayment', () => {
    describe('when createPayment is called with a PIX payment method', () => {
      let payment: Payment | null;
      let response: {payment: Payment, preference: any}
      let createPayment: CreatePaymentDto;

      beforeEach(async () => {
        createPayment = {
          cpf: '19119119100',
          amount: 40,
          description: '',
          paymentMethod: Constants.PIX
        };
        response = await paymentController.createPayment(createPayment);
      });

      test('then it should call paymentService.createPayment', () => {
        expect(paymentService.createPayment).toHaveBeenCalledWith(
          createPayment,
        );
      });

      test('then is should return a payment', () => {
        expect(response).toEqual({payment: paymentStub(), preference: {}});
      });
    });

    describe('when createPayment is called with an invalid payment method', () => {
      let payment: Payment | null;
      let response: {payment: Payment, preference: any}
      let createPayment: CreatePaymentDto;

      beforeEach(async () => {
        createPayment = {
          cpf: '19119119100',
          amount: 40,
          description: '',
          paymentMethod: 'NONE'
        };
        response = await paymentController.createPayment(createPayment);
      });
    });
  });

  describe('updatePayment', () => {
    describe('when updatePayment is called', () => {
      let payment: Payment | null;
      let updatePayment: UpdatePaymentDto;

      beforeEach(async () => {
        updatePayment = {
          status: Constants.PAID,
        };
        payment = await paymentController.updatePayment(
          paymentStub().id,
          updatePayment,
        );
      });

      test('then it should call paymentService.updatePayment', () => {
        expect(paymentService.updatePayment).toHaveBeenCalledWith(
          paymentStub().id,
          updatePayment,
        );
      });

      test('then is should return a payment', () => {
        expect(payment).toEqual(paymentStub());
      });
    });
  });
});
