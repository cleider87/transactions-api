import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from '@transactions-api/transactions/ui/transactions.controller';
import { TransactionService } from '@transactions-api/transactions/application/services/transaction.service';
import { TransactionRepositoryImpl } from '@transactions-api/transactions/infrastructure/repositories/transaction.repository.impl';
import { TransactionOrmEntity } from '@transactions-api/transactions/infrastructure/orm/transaction.entity.orm';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity])],
  controllers: [TransactionsController],
  providers: [
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepositoryImpl,
    },
    TransactionService,
  ],
  exports: [TransactionService],
})
export class TransactionsModule {}
