import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';

describe('IdVO', () => {
  it('should create an instance with a valid UUID', () => {
    const id = uuidv4();
    const idVO = new IdVO(id);

    expect(isUuid(idVO.getValue())).toBe(true);
    expect(idVO.getValue()).toBe(id);
  });

  it('should generate a new UUID when no value is provided', () => {
    const idVO = new IdVO();

    expect(isUuid(idVO.getValue())).toBe(true);
  });

  it('should throw an error when an invalid UUID is provided', () => {
    expect(() => new IdVO('invalid-uuid')).toThrow(
      'Invalid ID format: invalid-uuid',
    );
  });

  it('should return true for equals method when IDs are the same', () => {
    const id = uuidv4();
    const idVO1 = new IdVO(id);
    const idVO2 = new IdVO(id);

    expect(idVO1.equals(idVO2)).toBe(true);
  });

  it('should return false for equals method when IDs are different', () => {
    const idVO1 = new IdVO(uuidv4());
    const idVO2 = new IdVO(uuidv4());

    expect(idVO1.equals(idVO2)).toBe(false);
  });

  it('should return the UUID as a string', () => {
    const id = uuidv4();
    const idVO = new IdVO(id);

    expect(idVO.toString()).toBe(id);
  });
});
