import { ApproveTransactionInput } from '@transactions-api/transactions/application/dto/approve-transaction.dto';
import { validate } from 'class-validator';

describe('ApproveTransactionInput', () => {
  it('should succeed with valid data', async () => {
    const input = new ApproveTransactionInput();
    input.adminId = '123e4567-e89b-12d3-a456-426614174000';

    const errors = await validate(input);
    expect(errors.length).toBe(0);
  });

  it('should fail if adminId is not a UUID', async () => {
    const input = new ApproveTransactionInput();
    input.adminId = 'invalid-uuid';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isUuid).toBeDefined();
  });

  it('should fail if adminId is empty', async () => {
    const input = new ApproveTransactionInput();
    input.adminId = '';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if adminId is not a string', async () => {
    const input = new ApproveTransactionInput();
    (input.adminId as any) = 12345;

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
