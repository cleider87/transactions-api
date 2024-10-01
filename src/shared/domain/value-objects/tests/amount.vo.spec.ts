import { AmountVO } from '@transactions-api/shared/domain/value-objects/amount.vo';

describe('AmountVO', () => {
  it('should create an instance with a valid amount', () => {
    const amount = new AmountVO(100);
    expect(amount.getValue()).toBe(100);
  });

  it('should throw an error for NaN value', () => {
    expect(() => new AmountVO(NaN)).toThrow(
      'Invalid amount: NaN. Amount must be a non-negative number.',
    );
  });

  it('should throw an error for negative value', () => {
    expect(() => new AmountVO(-50)).toThrow(
      'Invalid amount: -50. Amount must be a non-negative number.',
    );
  });

  it('should add two AmountVOs correctly', () => {
    const amount1 = new AmountVO(100);
    const amount2 = new AmountVO(50);
    const result = amount1.add(amount2);

    expect(result.getValue()).toBe(150);
  });

  it('should subtract two AmountVOs correctly', () => {
    const amount1 = new AmountVO(100);
    const amount2 = new AmountVO(30);
    const result = amount1.subtract(amount2);

    expect(result.getValue()).toBe(70);
  });

  it('should throw an error when subtracting results in a negative amount', () => {
    const amount1 = new AmountVO(50);
    const amount2 = new AmountVO(100);

    expect(() => amount1.subtract(amount2)).toThrow(
      'Resulting amount cannot be negative.',
    );
  });

  it('should multiply an AmountVO correctly', () => {
    const amount = new AmountVO(10);
    const result = amount.multiply(3);

    expect(result.getValue()).toBe(30);
  });

  it('should return true for equals method when amounts are the same', () => {
    const amount1 = new AmountVO(100);
    const amount2 = new AmountVO(100);

    expect(amount1.equals(amount2)).toBe(true);
  });

  it('should return false for equals method when amounts are different', () => {
    const amount1 = new AmountVO(100);
    const amount2 = new AmountVO(50);

    expect(amount1.equals(amount2)).toBe(false);
  });

  it('should return true for greaterThan method when first amount is greater', () => {
    const amount1 = new AmountVO(100);
    const amount2 = new AmountVO(50);

    expect(amount1.greaterThan(amount2)).toBe(true);
  });

  it('should return false for greaterThan method when first amount is not greater', () => {
    const amount1 = new AmountVO(50);
    const amount2 = new AmountVO(100);

    expect(amount1.greaterThan(amount2)).toBe(false);
  });

  it('should return true for lessThan method when first amount is less', () => {
    const amount1 = new AmountVO(50);
    const amount2 = new AmountVO(100);

    expect(amount1.lessThan(amount2)).toBe(true);
  });

  it('should return false for lessThan method when first amount is not less', () => {
    const amount1 = new AmountVO(100);
    const amount2 = new AmountVO(50);

    expect(amount1.lessThan(amount2)).toBe(false);
  });

  it('should return the amount as a formatted string', () => {
    const amount = new AmountVO(123.456);

    expect(amount.toString()).toBe('123.46');
  });
});
