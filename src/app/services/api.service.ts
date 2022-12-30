import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Image } from '../types';
import { apiBaseUrl } from '../constants';

const imagesEndpoint = `${apiBaseUrl}/images`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAllImages() {
    return this.http.get<Image[]>(imagesEndpoint);
  }

  addImage(image: Pick<Image, 'name' | 'content' | 'tags'>) {
    return this.http.post<Pick<Image, '_id' | 'tags' | 'createdAt'>>(imagesEndpoint, image);
  }

  updateImage(_id: string, payload: Partial<Image>) {
    return this.http.put<void>(`${imagesEndpoint}/${_id}`, payload);
  }

  deleteImage(_id: string) {
    return this.http.delete<void>(`${imagesEndpoint}/${_id}`);
  }
}
