import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@transactions-api/shared/domain/value-objects/roles.vo';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTokenInput {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5c...',
  })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}

export class VerifyTokenOutput {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: Role })
  @IsString()
  @IsNotEmpty()
  roles: string[];
}
