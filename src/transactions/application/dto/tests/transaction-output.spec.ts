import { TransactionOutput } from '@transactions-api/transactions/application/dto/transaction-output.dto';

describe('TransactionOutput', () => {
  it('should match the output structure', () => {
    const output: TransactionOutput = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fromAccountId: '123e4567-e89b-12d3-0000-426614174000',
      toAccountId: '123e4567-e89b-12d3-a456-426614174445',
      amount: 100,
      description: 'Transfer',
      status: 'pending',
      createdAt: new Date(),
      validatedAt: new Date(),
      validatedBy: '123e4567-e89b-12d3-a456-426614174005',
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
