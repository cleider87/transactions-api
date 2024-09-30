import { SetMetadata } from '@nestjs/common';
import { Role } from '@transactions-api/shared/domain/value-objects/roles.vo';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
