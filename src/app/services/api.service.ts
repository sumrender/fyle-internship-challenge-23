// import { Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { IRepository } from 'src/models/repository.model';
import { IUser } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string) {
    return this.httpClient.get<IUser>(
      `https://api.github.com/users/${githubUsername}`
    );
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
  getRepositories(
    githubUsername: string,
    currentPage: number = 1,
    perPage: number = 10
  ) {
    let params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('per_page', perPage.toString());
    params.set('sort', 'pushed');
    const reposUrl = `https://api.github.com/users/${githubUsername}/repos?${params.toString()}`;
    return this.httpClient.get<IRepository[]>(reposUrl);
  }
}
