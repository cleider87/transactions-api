import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '@transactions-api/shared/domain/exceptions/domain.exception';
import { DomainExceptionFilter } from '@transactions-api/shared/infrastructure/filters/domain-exception.filter';

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let mockResponse: Response;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should catch a DomainException and return the correct response', () => {
    const exception = new DomainException('This is a domain error', 'ERR001');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      errorCode: exception.code,
    });
  });

  it('should catch a DomainException with default code', () => {
    const exception = new DomainException('Default code error');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      errorCode: 'DOMAIN_ERROR',
    });
  });
});
