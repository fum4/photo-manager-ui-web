import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

import type { AuthTokens, Credentials } from './auth.service';

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
      } = jwt_decode<Credentials>(accessToken);

      return { userId, name, email };
    }

    throw new Error('Tokens are not valid');
  };

  clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
