export const paymentStub = () => {
  return {
    id: 1,
    cpf: '19119119100',
    description: 'Nothing',
    amount: 40,
    paymentMethod: 'PIX',
    status: 'PENDING',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  };
};
