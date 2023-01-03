import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

import type { AuthTokens } from './auth.service';

export interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  saveTokens = ({ accessToken, refreshToken }: AuthTokens) => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);

      const {
        userId, name, email
      } = jwt_decode<JwtPayload>(accessToken);

      return { userId, name, email };
    }

    return {} as JwtPayload;
  };

  clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
