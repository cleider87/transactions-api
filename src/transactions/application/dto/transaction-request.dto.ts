import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class TransactionRequestInput {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  fromAccountId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  toAccountId: string;

  @IsNumber()
  @Min(0, { message: 'Amount must be greater than zero' })
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export interface TransactionRequestOutput {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  status: string;
  createdAt: Date;
  validatedAt: Date;
  validatedBy: string;
}
