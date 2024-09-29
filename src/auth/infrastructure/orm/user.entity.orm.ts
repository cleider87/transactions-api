import { UserRole } from '@transactions-api/auth/domain/entities/user.entity';
import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';
import { BaseOrmEntity } from '@transactions-api/shared/infrastructure/orm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntityORM extends BaseOrmEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  hashedPassword: string;

  @Column('text', { array: true })
  roles: UserRole[];

  @Column({ default: true })
  isActive: boolean;

  constructor(
    username: string,
    hashedPassword: string,
    isActive: boolean = true,
    roles: UserRole[] = ['user'],
  ) {
    super();
    this.username = username;
    this.hashedPassword = hashedPassword;
    this.isActive = isActive;
    this.roles = roles;
  }

  public getCredentials(): UserCredentialsVO {
    return new UserCredentialsVO(this.username, this.hashedPassword);
  }

  public getRoles(): UserRole[] {
    return this.roles;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }
}
