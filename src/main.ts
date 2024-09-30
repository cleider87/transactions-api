import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@transactions-api/app.module';
import { DomainExceptionFilter } from '@transactions-api/shared/infrastructure/filters/domain-exception.filter';
import { LoggingUtil } from '@transactions-api/shared/utils/logging.util';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const appName = configService.get<string>('app.name');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix(apiPrefix || 'api');
  app.use(helmet());
  app.enableCors();
  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(port);

  LoggingUtil.initialize(configService);
  LoggingUtil.log(`${appName} running on: ${port}`);
}
bootstrap();
