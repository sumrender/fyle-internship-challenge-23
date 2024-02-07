import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  username: string = '';

  constructor(private router: Router) {}

  search() {
    if (this.username.trim() !== '') {
      this.router.navigate([`/${this.username}`]);
    }
  }
}
