import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
  type HttpRequest,
  type HttpHandler,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { type Observable, catchError, switchMap, EMPTY } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { type AuthTokens, AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private injector: Injector,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {}

  invalidRefreshToken = false;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.authService = this.injector.get(AuthService);

    if (request.url.endsWith('/auth/google')) {
      this.invalidRefreshToken = false;
    }

    request = this.setAuthHeader(request);

    return next.handle(request).pipe(catchError((error) => (
      this.handleResponseError(error, request, next)
    )));
  }

  handleResponseError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler) {
    switch (error.status) {
      case 401: {
        if (error.url?.endsWith('/auth/refresh-token')) {
          console.error('Refresh token expired. Login required');

          this.invalidRefreshToken = true;
          this.authService.clearUser();
          this.spinner.hide();
          this.router.navigate([ '/auth' ]);

          return EMPTY;
        }

        if (!this.invalidRefreshToken) {
          console.log('Refreshing token...');

          return this.authService.refreshToken().pipe(
            switchMap((tokens) => {
              if (tokens?.accessToken && tokens.refreshToken) {
                this.jwtService.saveTokens(tokens);

                request = this.setAuthHeader(request, tokens);
              }

              return next.handle(request);
            })
          );
        }

        return EMPTY;
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
