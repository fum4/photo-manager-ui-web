import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.scss' ]
})
export class AuthComponent {
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private router: Router
  ) {
    this.titleService.setTitle(this.title);
  }

  authStatusSubscription = new Subscription;
  title = 'Photo Manager | Sign in';

  ngOnInit() {
    this.authStatusSubscription = this.authService.status.subscribe(({ isAuthenticated }) => {
      if (isAuthenticated) {
        this.router.navigate([ 'dashboard' ]);
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSubscription?.unsubscribe();
  }
}
