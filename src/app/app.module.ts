import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  SocialLoginModule,
  GoogleLoginProvider,
  type SocialAuthServiceConfig
} from '@abacritt/angularx-social-login';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { JwtService } from './services/jwt.service';
import { AppInterceptor } from './app.interceptor';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TagsComponent } from './components/tags/tags.component';
import { apiKeys } from './constants';

const SocialAuthService = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(apiKeys.google.clientId),
      },
    ],
  } as SocialAuthServiceConfig
};

@NgModule({
  declarations: [
    AppComponent,
    ImagePreviewComponent,
    TagsComponent,
    ThumbnailsComponent,
    DragAndDropDirective,
    FormatDatePipe
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SocialLoginModule
  ],
  providers: [
    JwtService,
    ApiService,
    AuthService,
    SocialAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true,
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
