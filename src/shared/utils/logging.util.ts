import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class LoggingUtil {
  private static readonly logger = new Logger('AppLogger');
  private static logLevel: string;

  public static initialize(configService: ConfigService) {
    this.logLevel = configService.get<string>('logLevel') || 'debug';
    this.logger.log(`Logging level set to: ${this.logLevel}`);
  }

  public static log(message: string) {
    if (this.shouldLog('log')) {
      this.logger.log(message);
    }
  }

  public static error(message: string, trace: string) {
    if (this.shouldLog('error')) {
      this.logger.error(message, trace);
    }
  }

  public static warn(message: string) {
    if (this.shouldLog('warn')) {
      this.logger.warn(message);
    }
  }

  public static debug(message: string) {
    if (this.shouldLog('debug')) {
      this.logger.debug(message);
    }
  }

  public static verbose(message: string) {
    if (this.shouldLog('verbose')) {
      this.logger.verbose(message);
    }
  }

  private static shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'log', 'debug', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }
}
