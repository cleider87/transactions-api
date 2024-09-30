import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from '@transactions-api/transactions/application/services/transaction.service';
import { TransactionOrmEntity } from '@transactions-api/transactions/infrastructure/orm/transaction.entity.orm';
import { TransactionRepositoryImpl } from '@transactions-api/transactions/infrastructure/repositories/transaction.repository.impl';
import { TransactionsController } from '@transactions-api/transactions/ui/transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity]), HttpModule],
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
