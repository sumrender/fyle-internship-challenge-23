import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-repo-card',
  templateUrl: './repo-card.component.html',
})
export class RepoCardComponent {
  @Input() repo: any;
}
