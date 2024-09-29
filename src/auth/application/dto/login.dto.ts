import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  tokenType: string;
}
