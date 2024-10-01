import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';
import { DateVO } from '@transactions-api/shared/domain/value-objects/date.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { TransactionService } from '@transactions-api/transactions/application/services/transaction.service';
import { TransactionEntity } from '@transactions-api/transactions/domain/entities/transaction.entity';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';
import { TransactionRepositoryImpl } from '@transactions-api/transactions/infrastructure/repositories/transaction.repository.impl';

describe('TransactionService', () => {
  let service: TransactionService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let transactionRepository: TransactionRepositoryImpl;

  const mockTransactionRepository = {
    save: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'TransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<TransactionRepositoryImpl>(
      'TransactionRepository',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestTransaction', () => {
    it('should create and save a new transaction', async () => {
      const fromAccountId = new IdVO();
      const toAccountId = new IdVO();
      const amount = new AmountVO(1000);
      const description = 'Test transaction';
      const id = new IdVO('123e4567-e89b-12d3-a456-426614174001');

      const mockTransaction = new TransactionEntity(
        id,
        fromAccountId,
        toAccountId,
        amount,
        description,
        TransactionStatus.PENDING,
        DateVO.now(),
      );

      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.requestTransaction(
        fromAccountId,
        toAccountId,
        amount,
        description,
      );

      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.PENDING);
      expect(result.amount).toBe(1000);
    });
  });

  describe('approveTransaction', () => {
    it('should approve the transaction', async () => {
      const adminId = new IdVO('123e4567-e89b-12d3-a456-426614174001');
      const transactionId = new IdVO();
      const mockTransaction = new TransactionEntity(
        transactionId,
        new IdVO(),
        new IdVO(),
        new AmountVO(1000),
        'Test transaction',
        TransactionStatus.PENDING,
        DateVO.now(),
      );

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.approveTransaction(transactionId, adminId);

      expect(result).toBeDefined();
      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId.getValue(),
      );
      expect(mockTransactionRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(TransactionStatus.APPROVED);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const transactionId = new IdVO();
      const adminId = new IdVO();

      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(
        service.approveTransaction(transactionId, adminId),
      ).rejects.toThrow(NotFoundException);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId.getValue(),
      );
    });
  });

  describe('rejectTransaction', () => {
    it('should reject the transaction', async () => {
      const adminId = new IdVO();
      const transactionId = new IdVO();
      const mockTransaction = new TransactionEntity(
        transactionId,
        new IdVO(),
        new IdVO(),
        new AmountVO(1000),
        'Test transaction',
        TransactionStatus.PENDING,
        DateVO.now(),
      );

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.rejectTransaction(transactionId, adminId);

      expect(result).toBeDefined();
      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId.getValue(),
      );
      expect(result.status).toBe(TransactionStatus.REJECTED);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      const transactionId = new IdVO('123e4567-e89b-12d3-a456-426614174001');
      const adminId = new IdVO();

      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(
        service.rejectTransaction(transactionId, adminId),
      ).rejects.toThrow(NotFoundException);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(
        transactionId.getValue(),
      );
    });
  });
});
