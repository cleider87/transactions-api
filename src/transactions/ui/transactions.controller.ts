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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { Role } from '@transactions-api/shared/domain/value-objects/roles.vo';
import { AuthGuard } from '@transactions-api/shared/infrastructure/guards/auth.guard';
import { Roles } from '@transactions-api/shared/infrastructure/guards/roles.guard';
import { TransactionService } from '@transactions-api/transactions/application/services/transaction.service';
import { ApproveTransactionInput } from '../application/dto/approve-transaction-input.dto';
import { RejectTransactionInput } from '../application/dto/reject-transaction-input.dto';
import { TransactionOutput } from '../application/dto/transaction-output.dto';
import { TransactionRequestInput } from '../application/dto/transaction-request-input.dto';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('request')
  @Roles(Role.User)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The transaction has been successfully created.',
    type: TransactionOutput,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async requestTransaction(
    @Body() transactionRequestInput: TransactionRequestInput,
  ): Promise<TransactionOutput> {
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
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The transaction has been approved.',
    type: TransactionOutput,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async approveTransaction(
    @Param('id') transactionId: string,
    @Body() approveTransactionInput: ApproveTransactionInput,
  ): Promise<TransactionOutput> {
    return await this.transactionService.approveTransaction(
      new IdVO(transactionId),
      new IdVO(approveTransactionInput.adminId),
    );
  }

  @Put(':id/reject')
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The transaction has been rejected.',
    type: TransactionOutput,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async rejectTransaction(
    @Param('id') transactionId: string,
    @Body() rejectRequestInput: RejectTransactionInput,
  ): Promise<TransactionOutput> {
    return await this.transactionService.rejectTransaction(
      new IdVO(transactionId),
      new IdVO(rejectRequestInput.adminId),
    );
  }
}
