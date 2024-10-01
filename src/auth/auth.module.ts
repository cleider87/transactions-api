import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '@transactions-api/auth/application/services/auth.service';
import { JwtStrategy } from '@transactions-api/auth/application/strategies/jwt.strategy';
import { UserEntityORM } from '@transactions-api/auth/infrastructure/orm/user.entity.orm';
import { UserRepositoryImpl } from '@transactions-api/auth/infrastructure/repositories/user-repository.impl';
import { AuthController } from '@transactions-api/auth/ui/auth.controller';
import { Role } from '@transactions-api/shared/domain/value-objects/roles.vo';
import { LoggingUtil } from '@transactions-api/shared/utils/logging.util';

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
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  // TODO: improve this seed
  async onModuleInit() {
    const adminExists = await this.authService.findUserByUsername('admin');
    if (!adminExists) {
      await this.authService.register(
        {
          username: 'admin',
          password: 'adminpassword',
        },
        [Role.Admin],
      );
      LoggingUtil.log('Admin user created');
    }

    const demo1Exists = await this.authService.findUserByUsername('demo1');
    if (!demo1Exists) {
      await this.authService.register({
        username: 'demo1',
        password: 'userpassword1',
      });
      LoggingUtil.log('User created');
    }

    const demo2Exists = await this.authService.findUserByUsername('demo2');
    if (!demo2Exists) {
      await this.authService.register({
        username: 'demo2',
        password: 'userpassword1',
      });
      LoggingUtil.log('User created');
    }
  }
}
