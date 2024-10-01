import { validate } from 'class-validator';
import { TransactionRequestInput } from '@transactions-api/transactions/application/dto/transaction-request-input.dto';

describe('TransactionRequestInput', () => {
  it('should succeed with valid data', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = '123e4567-e89b-12d3-a456-426614174000';
    input.toAccountId = '123e4567-e89b-12d3-a456-426614174001';
    input.amount = 100;
    input.description = 'Transfer';

    const errors = await validate(input);
    expect(errors.length).toBe(0);
  });

  it('should fail if fromAccountId is not a UUID', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = 'invalid-uuid';
    input.toAccountId = '123e4567-e89b-12d3-a456-426614174001';
    input.amount = 100;
    input.description = 'Transfer';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isUuid).toBeDefined();
  });

  it('should fail if toAccountId is not a UUID', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = '123e4567-e89b-12d3-a456-426614174000';
    input.toAccountId = 'invalid-uuid';
    input.amount = 100;
    input.description = 'Transfer';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isUuid).toBeDefined();
  });

  it('should fail if amount is negative', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = '123e4567-e89b-12d3-a456-426614174000';
    input.toAccountId = '123e4567-e89b-12d3-a456-426614174001';
    input.amount = -50;
    input.description = 'Transfer';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail if amount is empty', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = '123e4567-e89b-12d3-a456-426614174000';
    input.toAccountId = '123e4567-e89b-12d3-a456-426614174001';
    (input.amount as any) = '';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if description is empty', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = '123e4567-e89b-12d3-a456-426614174000';
    input.toAccountId = '123e4567-e89b-12d3-a456-426614174001';
    input.amount = 100;
    input.description = '';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if fromAccountId is not a string', async () => {
    const input = new TransactionRequestInput();
    (input.fromAccountId as any) = 12345;
    input.toAccountId = '123e4567-e89b-12d3-a456-426614174001';
    input.amount = 100;
    input.description = 'Transfer';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should fail if toAccountId is not a string', async () => {
    const input = new TransactionRequestInput();
    input.fromAccountId = '123e4567-e89b-12d3-a456-426614174000';
    (input.toAccountId as any) = 12345;
    input.amount = 100;
    input.description = 'Transfer';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
