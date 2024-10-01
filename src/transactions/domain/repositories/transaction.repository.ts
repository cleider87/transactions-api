import { TransactionEntity } from '@transactions-api/transactions/domain/entities/transaction.entity';

export interface TransactionRepository {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
  findById(transactionId: string): Promise<TransactionEntity | null>;
  update(transaction: TransactionEntity): Promise<TransactionEntity>;
}
