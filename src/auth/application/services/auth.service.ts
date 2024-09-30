import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginInput,
  LoginOutput,
} from '@transactions-api/auth/application/dto/login.dto';
import {
  RegisterInput,
  RegisterOutput,
} from '@transactions-api/auth/application/dto/register.dto';
import { VerifyTokenOutput } from '@transactions-api/auth/application/dto/verify-token.dto';
import { UserEntity } from '@transactions-api/auth/domain/entities/user.entity';
import { UserRepository } from '@transactions-api/auth/domain/repositories/user.repository';
import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { LoggingUtil } from '@transactions-api/shared/utils/logging.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<RegisterOutput> {
    const { username, password } = registerInput;
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCredentials = new UserCredentialsVO(username, hashedPassword);

    const newUser = new UserEntity(
      this.userRepository.generateId(),
      userCredentials,
    );

    await this.userRepository.save(newUser);

    return {
      id: newUser.getId().getValue(),
      username: newUser.getCredentials().getUsername(),
      isActive: newUser.isUserActive(),
    };
  }

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    const { username, password } = loginInput;
    const user = await this.userRepository.findByUsername(username);

    if (
      !user ||
      !(await this.verifyPassword(
        password,
        user.getCredentials().getHashedPassword(),
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      const payload = {
        username: user.getCredentials().getUsername(),
        sub: user.getId().getValue(),
        roles: user.getRoles(),
      };
      return {
        accessToken: this.jwtService.sign(payload),
        tokenType: 'Bearer',
      };
    } catch (error) {
      LoggingUtil.error('Error signing token:', error);
      throw new Error('Could not generate token');
    }
  }

  async verifyToken(token: string): Promise<VerifyTokenOutput> {
    try {
      const payload = this.jwtService.verify(token);
      return {
        userId: payload.sub,
        roles: payload.roles,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Could not verify token');
      }
    }
  }

  async validateUserById(userId: IdVO): Promise<UserEntity> {
    const user = await this.userRepository.findByUsername(userId.getValue());
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
