import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { IRepository } from 'src/models/repository.model';
import { IUser } from 'src/models/user.model';

@Component({
  selector: 'app-github-data',
  templateUrl: './github-data.component.html',
  styleUrls: ['./github-data.component.scss'],
})
export class GithubDataComponent {
  reposLoading = false;
  username: string = '';
  userProfile: IUser | undefined;
  userRepositories: IRepository[] = [];
  currentPage: number = 1;
  itemsChange = false;
  itemsPerPage: number = 9;
  totalPages: number = 1;
  errorMessage: string | undefined;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.fetchUserProfile();
    });
  }

  fetchUserProfile() {
    this.errorMessage = undefined;
    this.userProfile = undefined;
    this.apiService.getUser(this.username).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.fetchUserRepositories();
      },
      error: (error) => {
        console.log('Error fetching user profile:', error);
        if (error.status === 404) {
          this.errorMessage = `User '${this.username}' not found.`;
        } else {
          this.errorMessage = `Something went wrong! Please check your internet connection or again after some time.`;
        }
        this.userRepositories = [];
      },
    });
  }

  fetchUserRepositories() {
    if (this.userProfile) {
      this.reposLoading = true;

      let numPages = Math.ceil(
        this.userProfile.public_repos / this.itemsPerPage
      );
      this.totalPages = numPages == 0 ? 1 : numPages;
      const currPage = this.itemsChange ? 1 : this.currentPage;
      
      this.apiService
        .getRepositories(this.username, currPage, this.itemsPerPage)
        .subscribe({
          next: (repos) => {
            this.userRepositories = repos;
            this.reposLoading = false;
          },
          error: (error) => {
            this.reposLoading = false;
            console.error('Error fetching user repositories:', error);
            this.errorMessage = `Error fetching repositories. Please try again after some time.`;
          },
        });
    }
  }

  handleItemsChange() {
    this.itemsChange = true;
    this.fetchUserRepositories();
    this.itemsChange = false;
  }

  onPageChange(action: 'prev' | 'next' | number): void {
    switch (action) {
      case 'prev':
        this.currentPage = Math.max(1, this.currentPage - 1);
        break;
      case 'next':
        this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
        break;
      default:
        this.currentPage = action;
        break;
    }

    this.fetchUserRepositories();
  }
}
