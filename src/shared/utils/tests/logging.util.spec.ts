import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { LoggingUtil } from '../logging.util';

describe('LoggingUtil', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'logLevel') {
        return 'debug';
      }
    });

    LoggingUtil.initialize(configService);
  });

  it('should log a message if log level is log', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log');
    LoggingUtil.log('Test log message');
    expect(logSpy).toHaveBeenCalledWith('Test log message');
  });

  it('should log an error message', () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error');
    LoggingUtil.error('Test error message', 'Test stack trace');
    expect(errorSpy).toHaveBeenCalledWith(
      'Test error message',
      'Test stack trace',
    );
  });

  it('should not log debug messages if log level is warn', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('warn');
    LoggingUtil.initialize(configService);

    const debugSpy = jest.spyOn(Logger.prototype, 'debug');
    LoggingUtil.debug('Test debug message');
    expect(debugSpy).not.toHaveBeenCalled();
  });
});
