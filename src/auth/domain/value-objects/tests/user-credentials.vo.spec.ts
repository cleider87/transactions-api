import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';

describe('UserCredentialsVO', () => {
  it('should return username and hashed password', () => {
    const credentials = new UserCredentialsVO('testuser', 'hashedPassword123');
    expect(credentials.getUsername()).toBe('testuser');
    expect(credentials.getHashedPassword()).toBe('hashedPassword123');
  });

  it('should correctly compare two credentials', () => {
    const credentials1 = new UserCredentialsVO('testuser', 'hashedPassword123');
    const credentials2 = new UserCredentialsVO('testuser', 'hashedPassword123');
    const credentials3 = new UserCredentialsVO('testuser', 'differentPassword');

    expect(credentials1.equals(credentials2)).toBe(true);
    expect(credentials1.equals(credentials3)).toBe(false);
  });
});
