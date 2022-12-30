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
    return this.http.get<(Image & { _id: string })[]>(imagesEndpoint);
  }

  addImage(file: Pick<Image, 'name' | 'content' | 'tags'>) {
    return this.http.post<(Pick<Image, 'tags' | 'createdAt'>) & { _id: string }>(imagesEndpoint, file);
  }

  updateImage(_id: string, payload: Partial<Image>) {
    return this.http.put<{ _id: string }>(`${imagesEndpoint}/${_id}`, payload);
  }

  removeImage(_id: string) {
    return this.http.delete<{ _id: string }>(`${imagesEndpoint}/${_id}`);
  }
}
