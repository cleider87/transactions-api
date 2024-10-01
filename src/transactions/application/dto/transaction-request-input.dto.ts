import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class TransactionRequestInput {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  fromAccountId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  toAccountId: string;

  @ApiProperty({
    example: 50,
  })
  @IsNumber()
  @Min(0, { message: 'Amount must be greater than zero' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: 'Payment for services',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
