import { UserEntityORM } from '@transactions-api/auth/infrastructure/orm/user.entity.orm';

describe('UserEntityORM', () => {
  let userEntity: UserEntityORM;

  beforeEach(() => {
    userEntity = new UserEntityORM(
      'testUser',
      '$2b$10$q0jlp8mAY/qEbXo/ItKEi.FmETdKm0sQ/tVI/RUyXfi4x5SK.EbUW',
      true,
      ['admin'],
    );
  });

  it('should create an instance of UserEntityORM', () => {
    expect(userEntity).toBeDefined();
    expect(userEntity).toBeInstanceOf(UserEntityORM);
  });

  it('should have a username', () => {
    expect(userEntity.username).toEqual('testUser');
  });

  it('should have a hashed password', () => {
    expect(userEntity.hashedPassword).toEqual(
      '$2b$10$q0jlp8mAY/qEbXo/ItKEi.FmETdKm0sQ/tVI/RUyXfi4x5SK.EbUW',
    );
  });

  it('should be active by default', () => {
    expect(userEntity.isActive).toBe(true);
  });

  it('should have roles', () => {
    expect(userEntity.roles).toEqual(['admin']);
  });

  it('should deactivate the user', () => {
    userEntity.deactivate();
    expect(userEntity.isActive).toBe(false);
  });

  it('should activate the user', () => {
    userEntity.deactivate();
    userEntity.activate();
    expect(userEntity.isActive).toBe(true);
  });
});
