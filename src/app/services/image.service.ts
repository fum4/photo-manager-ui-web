import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { endpoints } from '../constants';
import type { Image } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getAll(userId: string) {
    return this.http.get<Image[]>(`${endpoints.images}/${userId}`);
  }

  add(userId: string, image: Pick<Image, 'name' | 'content' | 'tags'>) {
    return this.http.post<Pick<Image, '_id' | 'tags' | 'createdAt'>>(`${endpoints.images}/${userId}`, image);
  }

  update(userId: string, assetId: string, payload: Partial<Image>) {
    return this.http.put<void>(`${endpoints.images}/${userId}/${assetId}`, payload);
  }

  delete(userId: string, assetId: string) {
    return this.http.delete<void>(`${endpoints.images}/${userId}/${assetId}`);
  }
}
