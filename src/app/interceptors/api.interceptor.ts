import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  type HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return next.handle(request);
  }
}
