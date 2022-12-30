import { isDevMode } from '@angular/core';

import { Image } from './types';

export const placeholderImage: Image = {
  _id: 'placeholder',
  name: 'placeholder',
  content: '/assets/placeholder.png',
  tags: [],
  initialTags: [],
};

export const apiBaseUrl = isDevMode() ? 'http://localhost:3000' : 'https://photomanager-api.herokuapp.com';
