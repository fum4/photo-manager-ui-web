import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  type HttpRequest,
  type HttpHandler,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { type Observable, catchError, switchMap } from 'rxjs';

import { type AuthTokens, AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private injector: Injector
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.authService = this.injector.get(AuthService);

    request = this.setAuthHeader(request);

    return next.handle(request).pipe(catchError((error) => (
       this.handleResponseError(error, request, next)
    )));
  }

  handleResponseError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): any {
    let retries = 3;

    switch(error.status) {
      case 401: {
        return this.authService.refreshToken().pipe(
          switchMap((tokens) => {
            if (tokens?.accessToken && tokens.refreshToken) {
              this.jwtService.saveTokens(tokens);
              request = this.setAuthHeader(request, tokens);
              retries = 3;
            }

            return next.handle(request);
          }),
          catchError((e) => {
            retries -= 1;
            return this.handleResponseError(e, request, next);
          }));
      }
      default: {
        throw error;
      }
    }
  }

  setAuthHeader(request: HttpRequest<any>, tokens?: AuthTokens) {
    const jwt = tokens?.accessToken || localStorage.getItem('accessToken');

    return request.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${jwt}`
      })
    });
  }
}