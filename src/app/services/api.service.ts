import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Image } from '../types';
import { apiBaseUrl } from '../constants';

const imagesEndpoint = `${apiBaseUrl}/images`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getImages() {
    return this.http.get<Image[]>(imagesEndpoint);
  }

  addImage(file: Pick<Image, '_id' | 'tags' | 'content'>) {
    return this.http.post<Pick<Image, '_id' | 'tags' | 'createdAt'>>(imagesEndpoint, file);
  }

  updateImage(_id: string, payload: Partial<Image>) {
    return this.http.put<Pick<Image, '_id'>>(`${imagesEndpoint}/${_id}`, payload);
  }

  removeImage(_id: string) {
    return this.http.delete<Pick<Image, '_id'>>(`${imagesEndpoint}/${_id}`);
  }
}
