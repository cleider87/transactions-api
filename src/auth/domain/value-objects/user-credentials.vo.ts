export class UserCredentialsVO {
  private readonly username: string;
  private readonly hashedPassword: string;

  constructor(username: string, hashedPassword: string) {
    this.username = username;
    this.hashedPassword = hashedPassword;
  }

  public getUsername(): string {
    return this.username;
  }

  public getHashedPassword(): string {
    return this.hashedPassword;
  }

  public equals(other: UserCredentialsVO): boolean {
    return (
      this.username === other.getUsername() &&
      this.hashedPassword === other.getHashedPassword()
    );
  }
}
