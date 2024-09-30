import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ApproveTransactionInput {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  adminId: string;
}

export interface ApproveTransactionOutput {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  status: string;
  createdAt: Date;
  validatedBy: string;
  validatedAt: Date;
  completedAt: Date;
}
