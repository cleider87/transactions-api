import { validate } from 'class-validator';
import { RejectTransactionInput } from '@transactions-api/transactions/application/dto/reject-transaction-input.dto';

describe('RejectTransactionInput', () => {
  it('should succeed with valid data', async () => {
    const input = new RejectTransactionInput();
    input.adminId = '123e4567-e89b-12d3-a456-426614174000';

    const errors = await validate(input);
    expect(errors.length).toBe(0);
  });

  it('should fail if adminId is not a UUID', async () => {
    const input = new RejectTransactionInput();
    input.adminId = 'invalid-uuid';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isUuid).toBeDefined();
  });

  it('should fail if adminId is empty', async () => {
    const input = new RejectTransactionInput();
    input.adminId = '';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if adminId is not a string', async () => {
    const input = new RejectTransactionInput();
    (input.adminId as any) = 12345;

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isString).toBeDefined();
  });
});
