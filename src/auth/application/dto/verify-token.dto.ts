import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTokenInput {
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}

export class VerifyTokenOutput {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roles: string[];
}
