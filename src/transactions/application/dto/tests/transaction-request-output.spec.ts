import { TransactionRequestOutput } from '@transactions-api/transactions/application/dto/transaction-request.dto';

describe('TransactionRequestOutput', () => {
  it('should match the output structure', () => {
    const output: TransactionRequestOutput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fromAccountId: 'account-123',
      toAccountId: 'account-456',
      amount: 100,
      description: 'Transfer',
      status: 'pending',
      createdAt: new Date(),
      validatedAt: new Date(),
      validatedBy: 'admin-123',
    };

    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('fromAccountId');
    expect(output).toHaveProperty('toAccountId');
    expect(output).toHaveProperty('amount');
    expect(output).toHaveProperty('description');
    expect(output).toHaveProperty('status');
    expect(output).toHaveProperty('createdAt');
    expect(output).toHaveProperty('validatedAt');
    expect(output).toHaveProperty('validatedBy');
  });
});
