import { Test, TestingModule } from '@nestjs/testing';
import {
  LoginInput,
  LoginOutput,
} from '@transactions-api/auth/application/dto/login.dto';
import { RegisterOutput } from '@transactions-api/auth/application/dto/register.dto';
import { AuthService } from '@transactions-api/auth/application/services/auth.service';
import { AuthController } from '@transactions-api/auth/ui/auth.controller';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const mockUser: RegisterOutput = {
      id: new IdVO().getValue(),
      username: 'testUser',
      isActive: true,
    };
    jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

    const result = await authController.register({
      username: 'testUser',
      password: 'testPassword',
    });
    expect(result).toBe(mockUser);
    expect(authService.register).toHaveBeenCalledWith({
      password: 'testPassword',
      username: 'testUser',
    });
  });

  it('should login a user and return a token', async () => {
    const loginInput: LoginInput = {
      username: 'testUser',
      password: 'testPassword',
    };

    const mockToken: LoginOutput = {
      accessToken: 'test-token',
      tokenType: 'Bearer',
    };

    jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

    const result = await authController.login(loginInput);
    expect(result).toEqual({
      accessToken: mockToken.accessToken,
      tokenType: 'Bearer',
    });
  });
});
