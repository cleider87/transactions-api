import { IdVO } from '@transactions-api/shared/domain/value-objects/id.vo';

export interface JwtPayload {
  username: string;
  sub: IdVO;
}
