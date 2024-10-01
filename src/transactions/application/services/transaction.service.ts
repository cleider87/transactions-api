import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { DateVO } from '@transactions-api/shared/domain/value-objects/date.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { TransactionOutput } from '@transactions-api/transactions/application/dto/transaction-output.dto';
import { TransactionEntity } from '@transactions-api/transactions/domain/entities/transaction.entity';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';
import { TransactionRepositoryImpl } from '@transactions-api/transactions/infrastructure/repositories/transaction.repository.impl';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionRepository')
    private readonly transactionRepository: TransactionRepositoryImpl,
  ) {}

  async requestTransaction(
    fromAccountId: IdVO,
    toAccountId: IdVO,
    amount: AmountVO,
    description: string,
  ): Promise<TransactionOutput> {
    const transactionRequest = new TransactionEntity(
      this.generateId(),
      fromAccountId,
      toAccountId,
      amount,
      description,
      TransactionStatus.PENDING,
      DateVO.now(),
    );

    const newTransaction =
      await this.transactionRepository.save(transactionRequest);

    return {
      id: transactionRequest.getId().getValue(),
      amount: newTransaction.getAmount().getValue(),
      description: newTransaction.getDescription(),
      fromAccountId: newTransaction.getFromAccountId().getValue(),
      toAccountId: newTransaction.getToAccountId().getValue(),
      status: newTransaction.getStatus(),
      createdAt: newTransaction.getCreatedAt().getValue(),
      validatedBy: newTransaction.getValidatedBy()?.getValue(),
      validatedAt: newTransaction.getValidatedAt()?.getValue(),
    };
  }

  async approveTransaction(
    transactionId: IdVO,
    adminId: IdVO,
  ): Promise<TransactionOutput> {
    const transaction = await this.transactionRepository.findById(
      transactionId.getValue(),
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId.getValue()} not found`,
      );
    }

    if (transaction.getStatus() != TransactionStatus.PENDING) {
      throw new ConflictException(
        `Transaction with id ${transactionId.getValue()} is already ${transaction.getStatus()}`,
      );
    }

    transaction.approve(adminId);

    const transactionUpdated =
      await this.transactionRepository.save(transaction);

    return {
      id: transactionUpdated.getId().getValue(),
      amount: transactionUpdated.getAmount().getValue(),
      description: transactionUpdated.getDescription(),
      fromAccountId: transactionUpdated.getFromAccountId().getValue(),
      toAccountId: transactionUpdated.getToAccountId().getValue(),
      status: transactionUpdated.getStatus(),
      createdAt: transactionUpdated.getCreatedAt().getValue(),
      validatedBy: transactionUpdated.getValidatedBy()?.getValue(),
      validatedAt: transactionUpdated.getValidatedAt()?.getValue(),
    };
  }

  async rejectTransaction(
    transactionId: IdVO,
    adminId: IdVO,
  ): Promise<TransactionOutput> {
    const transaction = await this.transactionRepository.findById(
      transactionId.getValue(),
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId.getValue()} not found`,
      );
    }

    if (transaction.getStatus() != TransactionStatus.PENDING) {
      throw new ConflictException(
        `Transaction with id ${transactionId.getValue()} is already ${transaction.getStatus()}`,
      );
    }

    transaction.reject(adminId);

    return {
      id: transaction.getId().getValue(),
      amount: transaction.getAmount().getValue(),
      description: transaction.getDescription(),
      fromAccountId: transaction.getFromAccountId().getValue(),
      toAccountId: transaction.getToAccountId().getValue(),
      status: transaction.getStatus(),
      createdAt: transaction.getCreatedAt().getValue(),
      validatedBy: transaction.getValidatedBy()?.getValue(),
      validatedAt: transaction.getValidatedAt()?.getValue(),
    };
  }

  private generateId(): IdVO {
    return new IdVO();
  }
}
