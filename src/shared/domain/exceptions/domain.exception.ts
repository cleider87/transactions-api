export class DomainException extends Error {
  public readonly message: string;
  public readonly code: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'DomainException';
    this.code = code || 'DOMAIN_ERROR';
    Error.captureStackTrace(this, DomainException);
  }
}
