import { DomainException } from '@transactions-api/shared/domain/exceptions/domain.exception';

describe('DomainException', () => {
  it('should create a DomainException with a custom message and code', () => {
    const errorMessage = 'This is a domain error';
    const errorCode = 'ERR001';
    const exception = new DomainException(errorMessage, errorCode);

    expect(exception).toBeInstanceOf(DomainException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.code).toBe(errorCode);
    expect(exception.name).toBe('DomainException');
  });

  it('should create a DomainException with a default code if none is provided', () => {
    const errorMessage = 'A domain error occurred';
    const exception = new DomainException(errorMessage);

    expect(exception.message).toBe(errorMessage);
    expect(exception.code).toBe('DOMAIN_ERROR');
    expect(exception.name).toBe('DomainException');
  });

  it('should include the error stack trace', () => {
    const errorMessage = 'Custom domain error';
    const exception = new DomainException(errorMessage);

    expect(exception.stack).toBeDefined();
  });
});
