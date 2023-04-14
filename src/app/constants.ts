import { isDevMode } from '@angular/core';

import type { Image } from './types';

export const placeholderImage: Image = {
  _id: 'placeholder',
  name: 'placeholder',
  content: '/assets/placeholder.png',
  tags: [],
  initialTags: [],
};

export const apiKeys = {
  google: {
    clientId: '876550227337-s4fja6gmhipgd2tdencb2a7tqk8164gp.apps.googleusercontent.com',
    clientSecret: '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'
  }
}

const localApiUrl = 'http://localhost:3000';
const vercelApiUrl = 'https://photo-manager-api.vercel.app';
const railwayApiUrl = 'https://photo-manager-api.up.railway.app';
const herokuApiUrl = 'https://photomanager-api.herokuapp.com';

const shouldEverUseRailwayAgain = false;
const shouldEverUseHerokuAgain = false;

const apiBaseUrl = isDevMode()
  ? localApiUrl
  : shouldEverUseHerokuAgain
    ? herokuApiUrl
    : shouldEverUseRailwayAgain
      ? railwayApiUrl
      : vercelApiUrl;

export const endpoints = {
  auth: `${apiBaseUrl}/auth`,
  images: `${apiBaseUrl}/images`,
}
