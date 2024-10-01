import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginInput,
  LoginOutput,
} from '@transactions-api/auth/application/dto/login.dto';
import {
  RegisterInput,
  RegisterOutput,
} from '@transactions-api/auth/application/dto/register.dto';
import {
  VerifyTokenInput,
  VerifyTokenOutput,
} from '@transactions-api/auth/application/dto/verify-token.dto';
import { AuthService } from '@transactions-api/auth/application/services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: RegisterOutput,
  })
  async register(
    @Body() registerInput: RegisterInput,
  ): Promise<RegisterOutput> {
    const user = await this.authService.register(registerInput);
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({
    description: 'The user has been successfully logged.',
    type: LoginOutput,
  })
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({
    description: 'The user has been successfully verified.',
    type: VerifyTokenOutput,
  })
  async verifyToken(
    @Body() verifyTokenInput: VerifyTokenInput,
  ): Promise<VerifyTokenOutput> {
    return this.authService.verifyToken(verifyTokenInput.token);
  }
}
