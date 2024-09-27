import { NestFactory } from '@nestjs/core';
import { AppModule } from '@transactions-api/app.module';
import { DomainExceptionFilter } from '@transactions-api/shared/infrastructure/filters/domain-exception.filter';
import { ConfigService } from '@nestjs/config';
import { LoggingUtil } from '@transactions-api/shared/utils/logging.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService to access app settings
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const apiPrefix = configService.get<string>('apiPrefix');
  const appName = configService.get<string>('appName');

  app.setGlobalPrefix(apiPrefix || 'api');
  app.enableCors();
  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(port);

  LoggingUtil.initialize(configService);
  LoggingUtil.log(`${appName} running on: ${port}`);
}
bootstrap();
