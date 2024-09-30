import { BaseOrmEntity } from '@transactions-api/shared/infrastructure/orm/base.entity';
import { TransactionStatus } from '@transactions-api/transactions/domain/value-objects/transaction-status.vo';
import { Entity, Column } from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity extends BaseOrmEntity {
  @Column()
  fromAccountId: string;

  @Column()
  toAccountId: string;

  @Column('decimal')
  amount: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: string;

  @Column({ nullable: true })
  validatedBy?: string;

  @Column({ nullable: true })
  validatedAt?: Date;
}
