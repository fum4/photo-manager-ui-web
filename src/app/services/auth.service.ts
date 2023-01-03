import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { JwtPayload } from './jwt.service';
import { endpoints } from '../constants';

export enum AuthProvider {
  Google = 'GOOGLE'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  userId = '';
  name = '';
  email = '';

  login(idToken: string, provider: AuthProvider) {
    const endpoint = `${endpoints.auth}/${provider.toLowerCase()}`;

    return this.http.post<AuthTokens>(endpoint, { idToken });
  }

  silentLogin() {
    return this.http.post<AuthTokens>(`${endpoints.auth}/jwt`, {});
  }

  logout() {
    return this.http.post(`${endpoints.auth}/logout`, {});
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<AuthTokens>(`${endpoints.auth}/refresh-token`, { refreshToken });
  }

  getCredentials() {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email
    };
  }

  setCredentials({ userId, name, email }: JwtPayload) {
    this.userId = userId;
    this.name = name;
    this.email = email;
  }

  clearCredentials() {
    this.userId = '';
    this.name = '';
    this.email = '';
  }
}
