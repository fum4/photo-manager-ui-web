import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { endpoints } from '../constants';

enum AuthProvider {
  Google = 'GOOGLE'
}

export interface LoginPayload {
  token: string;
  provider?: AuthProvider;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login({ token, provider }: LoginPayload) {
    return this.http.post<LoginResponse>(`${endpoints.auth}/${provider ? provider.toLowerCase() : ''}`, { token });
  }
}
