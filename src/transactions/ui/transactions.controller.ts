import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { AuthGuard } from '@transactions-api/shared/infrastructure/guards/auth.guard';
import { Roles } from '@transactions-api/shared/infrastructure/guards/roles.guard';
import { ApproveTransactionInput } from '@transactions-api/transactions/application/dto/approve-transaction.dto';
import { RejectTransactionInput } from '@transactions-api/transactions/application/dto/reject-transaction.dto';
import { TransactionRequestInput } from '@transactions-api/transactions/application/dto/transaction-request.dto';
import { TransactionService } from '@transactions-api/transactions/application/services/transaction.service';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('request')
  @Roles(['user'])
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async requestTransaction(
    @Body() transactionRequestInput: TransactionRequestInput,
  ) {
    const { amount, description, fromAccountId, toAccountId } =
      transactionRequestInput;
    return await this.transactionService.requestTransaction(
      new IdVO(fromAccountId),
      new IdVO(toAccountId),
      new AmountVO(amount),
      description,
    );
  }

  @Put(':id/approve')
  @Roles(['admin'])
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async approveTransaction(
    @Param('id') transactionId: string,
    @Body() approveTransactionInput: ApproveTransactionInput,
  ) {
    return await this.transactionService.approveTransaction(
      new IdVO(transactionId),
      new IdVO(approveTransactionInput.adminId),
    );
  }

  @Put(':id/reject')
  @Roles(['admin'])
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async rejectTransaction(
    @Param('id') transactionId: string,
    @Body() rejectRequestInput: RejectTransactionInput,
  ) {
    return await this.transactionService.rejectTransaction(
      new IdVO(transactionId),
      new IdVO(rejectRequestInput.adminId),
    );
  }
}
