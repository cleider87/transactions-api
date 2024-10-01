import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { ApproveTransactionInput } from '@transactions-api/transactions/application/dto/approve-transaction-input.dto';
import { RejectTransactionInput } from '@transactions-api/transactions/application/dto/reject-transaction-input.dto';
import { TransactionRequestInput } from '@transactions-api/transactions/application/dto/transaction-request-input.dto';
import { TransactionService } from '@transactions-api/transactions/application/services/transaction.service';
import { TransactionsController } from '@transactions-api/transactions/ui/transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionService: TransactionService;

  const mockTransactionService = {
    requestTransaction: jest.fn(),
    approveTransaction: jest.fn(),
    rejectTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestTransaction', () => {
    it('should call transactionService.requestTransaction with correct values', async () => {
      const requestInput: TransactionRequestInput = {
        amount: 100,
        description: 'Payment for services',
        fromAccountId: new IdVO().getValue(),
        toAccountId: new IdVO().getValue(),
      };

      const expectedResult = {
        id: new IdVO(),
        ...requestInput,
      };

      mockTransactionService.requestTransaction.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.requestTransaction(requestInput);

      expect(transactionService.requestTransaction).toHaveBeenCalledWith(
        new IdVO(requestInput.fromAccountId),
        new IdVO(requestInput.toAccountId),
        new AmountVO(requestInput.amount),
        requestInput.description,
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('approveTransaction', () => {
    it('should call transactionService.approveTransaction with correct values', async () => {
      const transactionId = new IdVO();
      const approveInput: ApproveTransactionInput = {
        adminId: new IdVO().getValue(),
      };

      const expectedResult = {
        id: transactionId,
        status: 'approved',
      };

      mockTransactionService.approveTransaction.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.approveTransaction(
        transactionId.getValue(),
        approveInput,
      );

      expect(transactionService.approveTransaction).toHaveBeenCalledWith(
        transactionId,
        new IdVO(approveInput.adminId),
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe('rejectTransaction', () => {
    it('should call transactionService.rejectTransaction with correct values', async () => {
      const transactionId = new IdVO();
      const rejectInput: RejectTransactionInput = {
        adminId: new IdVO().getValue(),
      };

      const expectedResult = {
        id: transactionId,
        status: 'REJECTED',
      };

      mockTransactionService.rejectTransaction.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.rejectTransaction(
        transactionId.getValue(),
        rejectInput,
      );

      expect(transactionService.rejectTransaction).toHaveBeenCalledWith(
        transactionId,
        new IdVO(rejectInput.adminId),
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
