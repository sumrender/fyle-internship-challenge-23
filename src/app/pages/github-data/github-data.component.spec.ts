import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubDataComponent } from './github-data.component';

describe('GithubDataComponent', () => {
  let component: GithubDataComponent;
  let fixture: ComponentFixture<GithubDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GithubDataComponent]
    });
    fixture = TestBed.createComponent(GithubDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
