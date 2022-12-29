import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Image } from '../types';
import { apiBaseUrl } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  apiUrl = `${apiBaseUrl}/images`;

  getImages() {
    return this.http.get<Image[]>(this.apiUrl);
  }

  addImage(file: Pick<Image, '_id' | 'tags' | 'content'>) {
    return this.http.post<Pick<Image, '_id' | 'tags' | 'createdAt'>>(this.apiUrl, file);
  }

  updateImage(_id: string, payload: Partial<Image>) {
    return this.http.put<Pick<Image, '_id'>>(`${this.apiUrl}/${_id}`, payload);
  }

  removeImage(_id: string) {
    return this.http.delete<Pick<Image, '_id'>>(`${this.apiUrl}/${_id}`);
  }
}
