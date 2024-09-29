import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@transactions-api/auth/domain/entities/user.entity';
import { UserRepository } from '@transactions-api/auth/domain/repositories/user.repository';
import { UserEntityORM } from '@transactions-api/auth/infrastructure/orm/user.entity.orm';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntityORM)
    private readonly userRepository: Repository<UserEntityORM>,
  ) {}

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user
      ? new UserEntity(
          new IdVO(user.id),
          user.getCredentials(),
          user.getRoles(),
          user.isActive,
        )
      : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const userEntityORM = new UserEntityORM(
      user.getCredentials().getUsername(),
      user.getCredentials().getHashedPassword(),
      user.isUserActive(),
      user.getRoles(),
    );
    await this.userRepository.save(userEntityORM);
    return user;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.findByUsername(user.getUsername());
    if (existingUser) {
      throw new Error('User already exists');
    }

    const userEntityORM = new UserEntityORM(
      user.getCredentials().getUsername(),
      user.getCredentials().getHashedPassword(),
      user.isUserActive(),
      user.getRoles(),
    );
    await this.userRepository.save(userEntityORM);
    return user;
  }

  async update(username: string, user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.findByUsername(username);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const userEntityORM = new UserEntityORM(
      user.getCredentials().getUsername(),
      user.getCredentials().getHashedPassword(),
      user.isUserActive(),
      user.getRoles(),
    );
    await this.userRepository.save(userEntityORM);
    return user;
  }

  async delete(username: string): Promise<void> {
    await this.userRepository.delete({ username });
  }

  generateId(): IdVO {
    return new IdVO();
  }
}
