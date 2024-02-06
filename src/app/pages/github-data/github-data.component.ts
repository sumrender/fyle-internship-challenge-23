import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-github-data',
  templateUrl: './github-data.component.html',
})
export class GithubDataComponent {
  username: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
    });
  }
}
