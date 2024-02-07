import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { IRepository } from 'src/models/repository.model';
import { IUser } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private cacheService: CacheService
  ) {}

  getUser(githubUsername: string): Observable<IUser> {
    const cacheKey = `getUser:${githubUsername}`;
    const cachedUser = this.cacheService.getFromCache<IUser>(cacheKey);

    if (cachedUser) {
      return of(cachedUser);
    } else {
      return this.httpClient
        .get<IUser>(`https://api.github.com/users/${githubUsername}`)
        .pipe(
          tap((user) => this.cacheService.addToCache<IUser>(cacheKey, user))
        );
    }
  }

  getRepositories(
    githubUsername: string,
    currentPage: number = 1,
    perPage: number = 10
  ): Observable<IRepository[]> {
    const cacheKey = `getRepositories:${githubUsername}:${currentPage}:${perPage}`;
    const cachedRepos = this.cacheService.getFromCache<IRepository[]>(cacheKey);

    if (cachedRepos) {
      return of(cachedRepos);
    } else {
      return this.httpClient
        .get<IRepository[]>(
          `https://api.github.com/users/${githubUsername}/repos?page=${currentPage}&per_page=${perPage}&sort=pushed`
        )
        .pipe(
          tap((repos) =>
            this.cacheService.addToCache<IRepository[]>(cacheKey, repos)
          )
        );
    }
  }
}
