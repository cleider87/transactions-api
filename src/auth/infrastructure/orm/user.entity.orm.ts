import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';
import { Role } from '@transactions-api/shared/domain/value-objects/roles.vo';
import { BaseOrmEntity } from '@transactions-api/shared/infrastructure/orm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntityORM extends BaseOrmEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  hashedPassword: string;

  @Column('text', { array: true })
  roles: Role[];

  @Column({ default: true })
  isActive: boolean;

  constructor(
    username: string,
    hashedPassword: string,
    isActive: boolean = true,
    roles: Role[] = [Role.User],
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

  public getRoles(): Role[] {
    return this.roles;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }
}
