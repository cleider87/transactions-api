import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '@transactions-api/shared/config/app.config';
import { AuthGuard } from '@transactions-api/shared/infrastructure/guards/auth.guard';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: join(
        __dirname,
        `../../../.env.${process.env.NODE_ENV || 'development'}`,
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres' | 'mysql' | 'sqlite'>(
          'database.type',
        ),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [__dirname + '/../**/*.entity.orm.js'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    HttpModule,
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class SharedModule {}
