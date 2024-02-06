import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GithubDataComponent } from './pages/github-data/github-data.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { RepoCardComponent } from './components/repo-card/repo-card.component';

const routes: Routes = [
  {
    path: ':username',
    component: GithubDataComponent,
    title: 'Github User',
  },
];

@NgModule({
  declarations: [
    AppComponent,
    GithubDataComponent,
    SearchComponent,
    RepoCardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
