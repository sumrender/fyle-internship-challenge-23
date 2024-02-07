import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  CACHE_KEY_PREFIX = 'fyle-github';
  CACHE_EXPIRATION_TIME = 10 * 60 * 1000;

  getCacheKey(query: string): string {
    const cacheKey = `${this.CACHE_KEY_PREFIX}:${query}`;
    return cacheKey;
  }

  getFromCache<T>(query: string): T | null {
    const cacheKey = this.getCacheKey(query);
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedData: {
        response: T;
        expirationTime: number;
      } = JSON.parse(cachedData);
      const expirationTime = parsedData.expirationTime;
      const currentTime = Date.now();
      if (currentTime < expirationTime) {
        return parsedData.response;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  addToCache<T>(query: string, response: T) {
    const cacheKey = this.getCacheKey(query);
    const expirationTime = Date.now() + this.CACHE_EXPIRATION_TIME;
    const dataToCache = { response, expirationTime };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  }
}
