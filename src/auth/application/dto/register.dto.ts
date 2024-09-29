import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterInput {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export interface RegisterOutput {
  id: string;
  username: string;
  isActive: boolean;
}
