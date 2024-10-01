import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInput {
  @ApiProperty({
    example: 'user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    example: 'pass',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginOutput {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5c...',
  })
  accessToken: string;

  @ApiProperty({
    example: 'Bearer',
  })
  tokenType: string;
}
