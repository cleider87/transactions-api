import { v4 as uuidv4, validate as isUuid } from 'uuid';

export class IdVO {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ? this.validate(value) : uuidv4();
  }

  private validate(value: string): string {
    if (!isUuid(value)) {
      throw new Error(`Invalid ID format: ${value}`);
    }
    return value;
  }

  public equals(other: IdVO): boolean {
    return this.value === other.value;
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}
