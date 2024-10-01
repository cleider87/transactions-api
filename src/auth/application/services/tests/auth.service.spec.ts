/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginInput } from '@transactions-api/auth/application/dto/login.dto';
import { RegisterInput } from '@transactions-api/auth/application/dto/register.dto';
import { AuthService } from '@transactions-api/auth/application/services/auth.service';
import { UserEntity } from '@transactions-api/auth/domain/entities/user.entity';
import { UserRepository } from '@transactions-api/auth/domain/repositories/user.repository';
import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: {
            findByUsername: jest.fn(),
            save: jest.fn(),
            generateId: jest.fn().mockReturnValue(new IdVO()),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>('UserRepository');
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerInput: RegisterInput = {
        username: 'testUser',
        password: 'testPassword',
      };

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockReturnValue('hashedPassword' as any);

      const result = await authService.register(registerInput);

      expect(userRepository.findByUsername).toHaveBeenCalledWith(
        registerInput.username,
      );
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        username: registerInput.username,
        isActive: true,
      });
    });

    it('should throw an error if username already exists', async () => {
      const registerInput: RegisterInput = {
        username: 'testUser',
        password: 'testPassword',
      };

      const existingUser = new UserEntity(
        new IdVO(),
        new UserCredentialsVO('testUser', 'hashedPassword'),
      );

      jest
        .spyOn(userRepository, 'findByUsername')
        .mockResolvedValue(existingUser);

      await expect(authService.register(registerInput)).rejects.toThrow(
        'Username already exists',
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginInput: LoginInput = {
        username: 'testUser',
        password: 'testPassword',
      };

      const user = new UserEntity(
        new IdVO(),
        new UserCredentialsVO('testUser', 'hashedPassword'),
      );

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(loginInput);

      expect(result).toEqual({
        accessToken: 'test-token',
        tokenType: 'Bearer',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginInput: LoginInput = {
        username: 'testUser',
        password: 'wrongPassword',
      };

      const user = new UserEntity(
        new IdVO(),
        new UserCredentialsVO('testUser', 'hashedPassword'),
      );

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false as any);

      await expect(authService.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUserById', () => {
    it('should return the user for a valid ID', async () => {
      const userId = new IdVO();
      const user = new UserEntity(
        userId,
        new UserCredentialsVO('testUser', 'hashedPassword'),
      );

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(user);

      const result = await authService.validateUserById(userId);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = new IdVO();

      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

      await expect(authService.validateUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
