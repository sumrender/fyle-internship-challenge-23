import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string) {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}`
    );
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
  // use URLSearchParams
  getRepositories(githubUsername: string, currentPage = 10, perPage = 10) {
    const reposUrl = `https://api.github.com/users/${githubUsername}/repos?page=${currentPage}&per_page=${perPage}`;

    return this.httpClient.get(reposUrl);
  }
}
