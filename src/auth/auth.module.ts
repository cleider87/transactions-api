import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@transactions-api/auth/ui/auth.controller';
import { UserEntityORM } from '@transactions-api/auth/infrastructure/orm/user.entity.orm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './application/services/auth.service';
import { UserRepositoryImpl } from './infrastructure/repositories/user-repository.impl';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

const repositories = TypeOrmModule.forFeature([UserEntityORM]);

@Module({
  imports: [
    ConfigModule,
    repositories,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret =
          configService.get<string>('security.jwtSecret') || 'defaultSecret';
        const expiresIn = configService.get<string>(
          'security.jwtExpirationTime',
        );
        return {
          global: true,
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    JwtStrategy,
    AuthService,
  ],
  exports: [repositories, AuthService],
})
export class AuthModule {}
