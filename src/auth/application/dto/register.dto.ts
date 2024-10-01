import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterInput {
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

export class RegisterOutput {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id: string;
  @ApiProperty({
    example: 'user',
  })
  username: string;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;
}
