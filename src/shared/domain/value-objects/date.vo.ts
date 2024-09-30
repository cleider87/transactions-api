import { DomainException } from '@transactions-api/shared/domain/exceptions/domain.exception';

export class DateVO {
  private readonly value: Date;

  constructor(value?: Date | string) {
    this.value = value ? this.validate(new Date(value)) : new Date();
  }

  private validate(value: Date): Date {
    if (isNaN(value.getTime())) {
      throw new DomainException(`Invalid date: ${value}`);
    }
    return value;
  }

  public getValue(): Date {
    return this.value;
  }

  public isBefore(other: DateVO): boolean {
    return this.value < other.getValue();
  }

  public isAfter(other: DateVO): boolean {
    return this.value > other.getValue();
  }

  public equals(other: DateVO): boolean {
    return this.value.getTime() === other.getValue().getTime();
  }

  public toString(): string {
    return this.value.toISOString();
  }

  public static now(): DateVO {
    return new DateVO(new Date());
  }
}
