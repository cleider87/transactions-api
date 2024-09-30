import { TransactionEntity } from '@transactions-api/transactions/domain/entities/transaction.entity';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { DateVO } from '@transactions-api/shared/domain/value-objects/date.vo';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';

describe('TransactionEntity', () => {
  let transaction: TransactionEntity;
  const id = new IdVO();
  const fromAccountId = new IdVO();
  const toAccountId = new IdVO();
  const amount = new AmountVO(100);
  const description = 'Payment for services';
  const status = TransactionStatus.APPROVED;
  const createdAt = DateVO.now();
  const validatedBy = new IdVO();
  const validatedAt = DateVO.now();

  beforeEach(() => {
    transaction = new TransactionEntity(
      id,
      fromAccountId,
      toAccountId,
      amount,
      description,
      status,
      createdAt,
      validatedBy,
      validatedAt,
    );
  });

  it('should create a transaction entity with correct values', () => {
    expect(transaction.getId()).toEqual(id);
    expect(transaction.getFromAccountId()).toEqual(fromAccountId);
    expect(transaction.getToAccountId()).toEqual(toAccountId);
    expect(transaction.getAmount()).toEqual(amount);
    expect(transaction.getDescription()).toBe(description);
    expect(transaction.getCreatedAt()).toEqual(createdAt);
    expect(transaction.getValidatedBy()).toEqual(validatedBy);
    expect(transaction.getValidatedAt()).toEqual(validatedAt);
    expect(transaction.getStatus()).toBe(status);
  });

  it('should approve the transaction', () => {
    const adminId = new IdVO();
    transaction.approve(adminId);

    expect(transaction.getStatus()).toBe(TransactionStatus.APPROVED);
    expect(transaction.getValidatedBy()).toEqual(adminId);
    expect(transaction.getValidatedAt()).not.toBeNull();
  });

  it('should reject the transaction', () => {
    const adminId = new IdVO();
    transaction.reject(adminId);

    expect(transaction.getStatus()).toBe(TransactionStatus.REJECTED);
    expect(transaction.getValidatedBy()).toEqual(adminId);
    expect(transaction.getValidatedAt()).not.toBeNull();
  });
});
