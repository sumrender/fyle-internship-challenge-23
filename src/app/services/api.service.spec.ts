import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { CacheService } from './cache.service';
import { IUser } from 'src/models/user.model';
import { IRepository } from 'src/models/repository.model';
import { DUMMY_USER } from 'src/dummy-data/dummy-user';
import { DUMMY_REPOS } from 'src/dummy-data/dummy-repos';

describe('ApiService', () => {
  let service: ApiService;
  let cacheService: CacheService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ApiService);
    cacheService = TestBed.inject(CacheService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUser', () => {
    const githubUsername = 'testUser';
    const userResponse: IUser = DUMMY_USER;

    it('should return user from cache if available', fakeAsync(() => {
      spyOn(cacheService, 'getFromCache').and.returnValue(userResponse);

      let result: IUser | undefined;

      service.getUser(githubUsername).subscribe((user) => {
        result = user;
      });

      tick();

      expect(result).toEqual(userResponse);
      expect(cacheService.getFromCache).toHaveBeenCalledWith(
        `getUser:${githubUsername}`
      );
      expect(
        httpTestingController.expectNone(
          'https://api.github.com/users/testUser'
        )
      ).toBeUndefined();
    }));

    it('should make HTTP request if user is not in cache', fakeAsync(() => {
      spyOn(cacheService, 'getFromCache').and.returnValue(null);

      let result: IUser | undefined;

      service.getUser(githubUsername).subscribe((user) => {
        result = user;
      });

      const req = httpTestingController.expectOne(
        `https://api.github.com/users/testUser`
      );
      req.flush(userResponse);

      tick();

      expect(result).toEqual(userResponse);
      expect(cacheService.getFromCache).toHaveBeenCalledWith(
        `getUser:${githubUsername}`
      );
    }));

    it('should handle non-existing user', fakeAsync(() => {
      spyOn(cacheService, 'getFromCache').and.returnValue(null);

      let errorResponse: any;

      service.getUser('nonExistingUser').subscribe({
        error: (error) => {
          errorResponse = error;
        },
      });

      const req = httpTestingController.expectOne(
        'https://api.github.com/users/nonExistingUser'
      );
      req.error(new ErrorEvent('404 Not Found'));

      tick();

      expect(errorResponse).toBeDefined();
    }));
  });

  describe('getRepositories', () => {
    const githubUsername = 'testUser';
    const currentPage = 1;
    const perPage = 10;
    const reposResponse: IRepository[] = DUMMY_REPOS;

    it('should return repositories from cache if available', fakeAsync(() => {
      spyOn(cacheService, 'getFromCache').and.returnValue(reposResponse);

      let result: IRepository[] | undefined;

      service
        .getRepositories(githubUsername, currentPage, perPage)
        .subscribe((repos) => {
          result = repos;
        });

      tick();

      expect(result).toEqual(reposResponse);
      expect(cacheService.getFromCache).toHaveBeenCalledWith(
        `getRepositories:testUser:1:10`
      );
      expect(
        httpTestingController.expectNone(
          `https://api.github.com/users/testUser/repos?page=1&per_page=10&sort=pushed`
        )
      ).toBeUndefined();
    }));

    it('should make HTTP request if repositories are not in cache and fetch only specified number of repositories', fakeAsync(() => {
      spyOn(cacheService, 'getFromCache').and.returnValue(null);

      let result: IRepository[] | undefined;

      service
        .getRepositories(githubUsername, currentPage, perPage)
        .subscribe((repos) => {
          result = repos;
        });

      const req = httpTestingController.expectOne(
        `https://api.github.com/users/testUser/repos?page=1&per_page=10&sort=pushed`
      );
      req.flush(reposResponse.slice(0, perPage));

      tick();

      expect(result).toEqual(reposResponse.slice(0, perPage));
      expect(cacheService.getFromCache).toHaveBeenCalledWith(
        `getRepositories:testUser:1:10`
      );
    }));

    it('should handle non-existing user', fakeAsync(() => {
      spyOn(cacheService, 'getFromCache').and.returnValue(null);

      let errorResponse: any;
      service
        .getRepositories('nonExistingUser', currentPage, perPage)
        .subscribe({
          error: (error) => {
            errorResponse = error;
          },
        });

      const req = httpTestingController.expectOne(
        `https://api.github.com/users/nonExistingUser/repos?page=1&per_page=10&sort=pushed`
      );
      req.error(new ErrorEvent('404 Not Found'));

      tick();

      expect(errorResponse).toBeDefined();
    }));
  });
});
