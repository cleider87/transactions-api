import { UserEntity } from '@transactions-api/auth/domain/entities/user.entity';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';

describe('UserEntity', () => {
  let userId: IdVO;
  let credentials: UserCredentialsVO;
  let user: UserEntity;

  beforeEach(() => {
    userId = new IdVO();
    credentials = new UserCredentialsVO('testUser', 'hashedPassword');
    user = new UserEntity(userId, credentials);
  });

  it('should create a UserEntity with the given properties', () => {
    expect(user.getId()).toBe(userId);
    expect(user.getCredentials()).toBe(credentials);
    expect(user.isUserActive()).toBe(true);
  });

  it('should return the username from credentials', () => {
    expect(user.getUsername()).toBe('testUser');
  });

  it('should deactivate the user', () => {
    user.deactivate();
    expect(user.isUserActive()).toBe(false);
  });

  it('should activate the user after being deactivated', () => {
    user.deactivate();
    expect(user.isUserActive()).toBe(false);

    user.activate();
    expect(user.isUserActive()).toBe(true);
  });
});
