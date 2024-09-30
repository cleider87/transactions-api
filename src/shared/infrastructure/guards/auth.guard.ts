import { HttpService } from '@nestjs/axios';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggingUtil } from '@transactions-api/shared/utils/logging.util';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      return false;
    }

    return this.httpService
      .post(`${process.env.AUTHENTICATION_SERVER}/verify`, { token })
      .pipe(
        map((response) => {
          request['user'] = response.data;
          return true;
        }),
        catchError(async (e) => {
          LoggingUtil.warn(e);
          return false;
        }),
      );
  }
}
