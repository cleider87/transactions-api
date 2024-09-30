import { Module } from '@nestjs/common';
import { AuthModule } from '@transactions-api/auth/auth.module';
import { SharedModule } from '@transactions-api/shared/shared.module';
import { TransactionsModule } from '@transactions-api/transactions/transactions.module';

@Module({
  imports: [SharedModule, AuthModule, TransactionsModule],
})
export class AppModule {}
