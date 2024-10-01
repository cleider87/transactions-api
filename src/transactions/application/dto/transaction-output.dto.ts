import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';

export class TransactionOutput {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  fromAccountId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  toAccountId: string;

  @ApiProperty({
    example: 152.0,
  })
  amount: number;

  @ApiProperty({
    example: 'Payment for services',
  })
  description: string;

  @ApiProperty({ example: TransactionStatus.PENDING })
  status: string;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174004',
  })
  validatedBy: string;

  @ApiProperty({
    example: new Date(),
  })
  validatedAt: Date;
}
