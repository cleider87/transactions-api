import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';

export type UserRole = 'admin' | 'user';

export class UserEntity {
  private id: IdVO;
  private credentials: UserCredentialsVO;
  private isActive: boolean;
  private roles: UserRole[];

  constructor(
    id: IdVO,
    credentials: UserCredentialsVO,
    roles: UserRole[] = ['user'],
    isActive: boolean = true,
  ) {
    this.id = id;
    this.credentials = credentials;
    this.roles = roles;
    this.isActive = isActive;
  }

  getId(): IdVO {
    return this.id;
  }

  getCredentials(): UserCredentialsVO {
    return this.credentials;
  }

  getUsername(): string {
    return this.credentials.getUsername();
  }

  getRoles(): UserRole[] {
    return this.roles;
  }

  addRole(role: UserRole): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
    }
  }

  removeRole(role: UserRole): void {
    this.roles = this.roles.filter((r) => r !== role);
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  isUserActive(): boolean {
    return this.isActive;
  }

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }
}
