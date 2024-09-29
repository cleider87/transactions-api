import { UserEntity } from '@transactions-api/auth/domain/entities/user.entity';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';

export interface UserRepository {
  findByUsername(username: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  create(user: UserEntity): Promise<UserEntity>;
  update(username: string, user: UserEntity): Promise<UserEntity>;
  delete(username: string): Promise<void>;
  generateId(): IdVO;
}
