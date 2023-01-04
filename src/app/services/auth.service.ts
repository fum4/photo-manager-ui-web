import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';

import { JwtService } from './jwt.service';
import { endpoints } from '../constants';

export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string;
  name: string;
  email: string;
}

export interface Credentials {
  userId: string;
  name: string;
  email: string;
}

export enum AuthProvider {
  Google = 'GOOGLE'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthorizationServerResponse {
  idToken: string;
  provider: AuthProvider;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private socialAuthService: SocialAuthService,
    private http: HttpClient
  ) {}

  status = new BehaviorSubject<AuthStatus>({
    isAuthenticated: false,
    isLoading: false,
    userId: '',
    name: '',
    email: ''
  });

  login({ idToken, provider }: AuthorizationServerResponse) {
    const endpoint = `${endpoints.auth}/${provider.toLowerCase()}`;

    this.setLoading();

    this.http.post<AuthTokens>(endpoint, { idToken }).subscribe({
      next: (payload) => this.setUser(payload)
    });
  }

  silentLogin() {
    this.setLoading();

    this.http.post<AuthTokens>(`${endpoints.auth}/jwt`, {}).subscribe({
      next: (payload) => this.setUser(payload)
    });
  }

  async logout() {
    this.setLoading();

    this.http.post(`${endpoints.auth}/logout`, {}).subscribe({
      next: () => this.clearUser()
    });

    try {
      await this.socialAuthService.signOut();
    } catch (error) {
      console.log('No social user found');
    }
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<AuthTokens>(`${endpoints.auth}/refresh-token`, { refreshToken });
  }

  setLoading(isLoading = true) {
    this.status.next({ ...this.status.getValue(), isLoading });
  }

  setUser(tokens: AuthTokens) {
    const credentials = this.jwtService.saveTokens(tokens);

    this.status.next({
      isAuthenticated: true,
      isLoading: false,
      ...credentials
    });
  }

  clearUser() {
    this.jwtService.clearSession();

    this.status.next({
      isAuthenticated: false,
      isLoading: false,
      userId: '',
      name: '',
      email: ''
    });
  }
}
