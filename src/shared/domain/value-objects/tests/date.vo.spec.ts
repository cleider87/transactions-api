import { DateVO } from '../date.vo';

describe('DateVO', () => {
  it('should create an instance with a valid Date object', () => {
    const date = new Date();
    const dateVO = new DateVO(date);
    expect(dateVO.getValue()).toEqual(date);
  });

  it('should create an instance with a valid date string', () => {
    const dateString = '2024-09-26T12:00:00Z';
    const dateVO = new DateVO(dateString);
    expect(dateVO.getValue()).toEqual(new Date(dateString));
  });

  it('should throw an error for invalid date', () => {
    expect(() => new DateVO('invalid-date')).toThrow(
      'Invalid date: Invalid Date',
    );
  });

  it('should return the current date with now() method', () => {
    const dateVO = DateVO.now();
    const now = new Date();
    expect(dateVO.getValue().getTime()).toBeCloseTo(now.getTime(), -2);
  });

  it('should retrieve the value correctly', () => {
    const date = new Date('2024-09-26T12:00:00Z');
    const dateVO = new DateVO(date);
    expect(dateVO.getValue()).toEqual(date);
  });

  it('should check if the date is before another date', () => {
    const date1 = new DateVO(new Date('2024-09-25'));
    const date2 = new DateVO(new Date('2024-09-26'));

    expect(date1.isBefore(date2)).toBe(true);
    expect(date2.isBefore(date1)).toBe(false);
  });

  it('should check if the date is after another date', () => {
    const date1 = new DateVO(new Date('2024-09-25'));
    const date2 = new DateVO(new Date('2024-09-26'));

    expect(date2.isAfter(date1)).toBe(true);
    expect(date1.isAfter(date2)).toBe(false);
  });

  it('should return true for equals method when dates are the same', () => {
    const date1 = new DateVO(new Date('2024-09-26'));
    const date2 = new DateVO(new Date('2024-09-26'));

    expect(date1.equals(date2)).toBe(true);
  });

  it('should return false for equals method when dates are different', () => {
    const date1 = new DateVO(new Date('2024-09-26'));
    const date2 = new DateVO(new Date('2024-09-25'));

    expect(date1.equals(date2)).toBe(false);
  });

  it('should return the date as an ISO formatted string', () => {
    const date = new Date('2024-09-26T12:00:00Z');
    const dateVO = new DateVO(date);

    expect(dateVO.toString()).toBe(date.toISOString());
  });
});
