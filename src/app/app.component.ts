import { Component } from '@angular/core';
import { SocialAuthService, type SocialUser } from '@abacritt/angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService, type AuthStatus, type AuthorizationServerResponse } from './services/auth.service';

enum AuthType {
  Silent = 'SILENT',
  OAuth = 'OAUTH'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private spinner: NgxSpinnerService
  ) {}

  title = 'Photo Manager';

  ngOnInit() {
    this.authService.status.subscribe(this.authObserver);
    this.socialAuthService.authState.subscribe(this.socialAuthObserver);

    this.trySilentAuth();
  }

  trySilentAuth = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      this.handleAuth(AuthType.Silent);
    }
  };

  handleAuth = (type: AuthType, payload?: AuthorizationServerResponse) => {
    switch (type) {
      case AuthType.Silent: {
        this.authService.silentLogin();

        break;
      }
      case AuthType.OAuth: {
        if (payload) {
          this.authService.login(payload);
        }

        break;
      }
    }
  };

  authObserver = ({ isLoading }: AuthStatus) => {
    isLoading ? this.spinner.show() : this.spinner.hide();
  };

  socialAuthObserver = (socialUser: SocialUser) => {
    if (socialUser) {
      const { idToken, provider } = socialUser;

      this.handleAuth(AuthType.OAuth, { idToken, provider } as AuthorizationServerResponse);
    }
  }
}
