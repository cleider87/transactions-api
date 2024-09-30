import { ApproveTransactionOutput } from '@transactions-api/transactions/application/dto/approve-transaction.dto';

describe('ApproveTransactionOutput', () => {
  it('should match the output structure', () => {
    const output: ApproveTransactionOutput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fromAccountId: 'account-123',
      toAccountId: 'account-456',
      amount: 100,
      description: 'Payment for services',
      status: 'approved',
      createdAt: new Date(),
      validatedBy: 'admin-123',
      validatedAt: new Date(),
      completedAt: new Date(),
    };

    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('fromAccountId');
    expect(output).toHaveProperty('toAccountId');
    expect(output).toHaveProperty('amount');
    expect(output).toHaveProperty('description');
    expect(output).toHaveProperty('status');
    expect(output).toHaveProperty('createdAt');
    expect(output).toHaveProperty('validatedBy');
    expect(output).toHaveProperty('validatedAt');
    expect(output).toHaveProperty('completedAt');
  });
});
