import { DomainException } from '@transactions-api/shared/domain/exceptions/domain.exception';

export class AmountVO {
  private readonly value: number;

  constructor(value: number) {
    this.value = this.validate(value);
  }

  private validate(value: number): number {
    if (isNaN(value) || value < 0) {
      throw new DomainException(
        `Invalid amount: ${value}. Amount must be a non-negative number.`,
      );
    }
    return value;
  }

  public getValue(): number {
    return this.value;
  }

  public add(other: AmountVO): AmountVO {
    return new AmountVO(this.value + other.getValue());
  }

  public subtract(other: AmountVO): AmountVO {
    const result = this.value - other.getValue();
    if (result < 0) {
      throw new DomainException('Resulting amount cannot be negative.');
    }
    return new AmountVO(result);
  }

  public multiply(multiplier: number): AmountVO {
    return new AmountVO(this.value * multiplier);
  }

  public equals(other: AmountVO): boolean {
    return this.value === other.getValue();
  }

  public greaterThan(other: AmountVO): boolean {
    return this.value > other.getValue();
  }

  public lessThan(other: AmountVO): boolean {
    return this.value < other.getValue();
  }

  public toString(): string {
    return this.value.toFixed(2);
  }
}
