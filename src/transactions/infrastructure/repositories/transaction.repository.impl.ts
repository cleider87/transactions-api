import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { DateVO } from '@transactions-api/shared/domain/value-objects/date.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { TransactionRepository } from '@transactions-api/transactions//domain/repositories/transaction.repository';
import { TransactionEntity } from '@transactions-api/transactions/domain/entities/transaction.entity';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';
import { TransactionOrmEntity } from '@transactions-api/transactions/infrastructure/orm/transaction.entity.orm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly ormRepository: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    const transactionOrm = this.toOrmEntity(transaction);
    const savedTransaction = await this.ormRepository.save(transactionOrm);
    return this.toDomainEntity(savedTransaction);
  }

  async findById(transactionId: string): Promise<TransactionEntity | null> {
    const transactionOrm = await this.ormRepository.findOne({
      where: { id: transactionId },
    });
    if (!transactionOrm) {
      return null;
    }
    return this.toDomainEntity(transactionOrm);
  }

  async update(transaction: TransactionEntity): Promise<TransactionEntity> {
    const transactionOrm = this.toOrmEntity(transaction);
    const updatedTransaction = await this.ormRepository.save(transactionOrm);
    return this.toDomainEntity(updatedTransaction);
  }

  private toOrmEntity(transaction: TransactionEntity): TransactionOrmEntity {
    const transactionOrm = new TransactionOrmEntity();
    transactionOrm.id = transaction.getId().getValue();
    transactionOrm.fromAccountId = transaction.getFromAccountId().getValue();
    transactionOrm.toAccountId = transaction.getToAccountId().getValue();
    transactionOrm.amount = transaction.getAmount().getValue();
    transactionOrm.description = transaction.getDescription();
    transactionOrm.status = transaction.getStatus();
    transactionOrm.createdAt = transaction.getCreatedAt().getValue();
    transactionOrm.validatedBy =
      transaction.getValidatedBy()?.getValue() || null;
    transactionOrm.validatedAt =
      transaction.getValidatedAt()?.getValue() || null;
    return transactionOrm;
  }

  private toDomainEntity(
    transactionOrm: TransactionOrmEntity,
  ): TransactionEntity {
    return new TransactionEntity(
      new IdVO(transactionOrm.id),
      new IdVO(transactionOrm.fromAccountId),
      new IdVO(transactionOrm.toAccountId),
      new AmountVO(transactionOrm.amount),
      transactionOrm.description,
      transactionOrm.status as TransactionStatus,
      new DateVO(transactionOrm.createdAt),
      transactionOrm.validatedBy
        ? new IdVO(transactionOrm.validatedBy)
        : undefined,
      transactionOrm.validatedAt
        ? new DateVO(transactionOrm.validatedAt)
        : undefined,
    );
  }
}
