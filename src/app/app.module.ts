import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ThumbnailsComponent } from './components/thumbnails/thumbnails.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { FormatDatePipe } from './pipes/format-date.pipe';

@NgModule({
  declarations: [ AppComponent, DragAndDropDirective, ThumbnailsComponent, ImagePreviewComponent, FormatDatePipe ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
  ],
  providers: [ ApiService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
