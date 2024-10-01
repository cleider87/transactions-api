import { UserCredentialsVO } from '@transactions-api/auth/domain/value-objects/user-credentials.vo';
import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';
import { Role } from '@transactions-api/shared/domain/value-objects/roles.vo';

export class UserEntity {
  private id: IdVO;
  private credentials: UserCredentialsVO;
  private isActive: boolean;
  private roles: Role[];

  constructor(
    id: IdVO,
    credentials: UserCredentialsVO,
    roles: Role[] = [Role.User],
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

  getRoles(): Role[] {
    return this.roles;
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

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }
}
