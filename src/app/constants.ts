import { isDevMode } from '@angular/core';

import type { Image } from './types';

export const placeholderImage: Image = {
  _id: 'placeholder',
  name: 'placeholder',
  content: '/assets/placeholder.png',
  tags: [],
  initialTags: [],
};

const localApiUrl = 'http://localhost:3000';
const railwayApiUrl = 'https://photo-manager-api.up.railway.app';
const herokuApiUrl = 'https://photomanager-api.herokuapp.com';

const shouldEverUseHerokuAgain = false;

export const apiBaseUrl = isDevMode() ? localApiUrl : shouldEverUseHerokuAgain ? herokuApiUrl : railwayApiUrl;
