import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { DateVO } from '@transactions-api/shared/domain/value-objects/date.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';

export class TransactionEntity {
  private readonly id: IdVO;
  private readonly fromAccountId: IdVO;
  private readonly toAccountId: IdVO;
  private readonly amount: AmountVO;
  private readonly description: string;
  private status: TransactionStatus;
  private readonly createdAt: DateVO;
  private validatedBy?: IdVO;
  private validatedAt?: DateVO;

  constructor(
    id: IdVO,
    fromAccountId: IdVO,
    toAccountId: IdVO,
    amount: AmountVO,
    description: string,
    status: TransactionStatus,
    createdAt: DateVO,
    validatedBy?: IdVO,
    validatedAt?: DateVO,
  ) {
    this.id = id;
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.amount = amount;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.validatedBy = validatedBy;
    this.validatedAt = validatedAt;
  }

  getId(): IdVO {
    return this.id;
  }

  getFromAccountId(): IdVO {
    return this.fromAccountId;
  }

  getToAccountId(): IdVO {
    return this.toAccountId;
  }

  getAmount(): AmountVO {
    return this.amount;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getValidatedBy(): IdVO | null {
    return this.validatedBy || null;
  }

  getValidatedAt(): DateVO | null {
    return this.validatedAt || null;
  }

  getStatus(): TransactionStatus {
    return this.status;
  }

  approve(adminId: IdVO): void {
    this.status = TransactionStatus.APPROVED;
    this.validatedBy = adminId;
    this.validatedAt = DateVO.now();
  }

  reject(adminId: IdVO): void {
    this.status = TransactionStatus.REJECTED;
    this.validatedBy = adminId;
    this.validatedAt = DateVO.now();
  }
}
