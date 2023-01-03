import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { endpoints } from '../constants';
import type { Image } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAllImages(userId: string) {
    return this.http.get<Image[]>(`${endpoints.images}/${userId}`);
  }

  addImage(userId: string, image: Pick<Image, 'name' | 'content' | 'tags'>) {
    return this.http.post<Pick<Image, '_id' | 'tags' | 'createdAt'>>(`${endpoints.images}/${userId}`, image);
  }

  updateImage(userId: string, assetId: string, payload: Partial<Image>) {
    return this.http.put<void>(`${endpoints.images}/${userId}/${assetId}`, payload);
  }

  deleteImage(userId: string, assetId: string) {
    return this.http.delete<void>(`${endpoints.images}/${userId}/${assetId}`);
  }
}
