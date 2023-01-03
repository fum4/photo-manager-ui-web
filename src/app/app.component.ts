import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';

import {
  AuthService,
  type AuthProvider,
  type AuthTokens
} from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  title = 'Photo Manager';

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');

    const authObserver = {
      next: this.onAuthSuccess,
      error: () => this.spinner.hide()
    };

    if (accessToken) {
      this.spinner.show();
      this.authService.silentLogin().subscribe(authObserver);
    }

    this.socialAuthService.authState.subscribe(({ idToken, provider }) => {
      if (idToken) {
        this.spinner.show();
        this.authService.login(idToken, provider as AuthProvider).subscribe(authObserver);

        this.router.navigate([ 'auth' ]);
      }
    });
  }

  onAuthSuccess = (tokens: AuthTokens) => {
    const { userId, name, email } = this.jwtService.saveTokens(tokens);
    this.authService.setCredentials({ userId, name, email });

    this.router.navigate([ 'dashboard' ]);
  }
}
