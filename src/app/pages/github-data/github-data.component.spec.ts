import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GithubDataComponent } from './github-data.component';
import { DUMMY_USER } from 'src/dummy-data/dummy-user';
import { DUMMY_REPOS } from 'src/dummy-data/dummy-repos';

describe('GithubDataComponent', () => {
  let component: GithubDataComponent;
  let fixture: ComponentFixture<GithubDataComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getUser',
      'getRepositories',
    ]);

    TestBed.configureTestingModule({
      declarations: [GithubDataComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ username: 'testUser' }),
            snapshot: {
              paramMap: convertToParamMap({ username: 'testUser' }),
            },
          },
        },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
      imports: [FormsModule],
    });

    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubDataComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user profile and repositories on init', fakeAsync(() => {
    apiService.getUser.and.returnValue(of(DUMMY_USER));
    apiService.getRepositories.and.returnValue(of(DUMMY_REPOS));

    component.ngOnInit();
    tick();

    expect(apiService.getUser).toHaveBeenCalledWith('testUser');
    expect(apiService.getRepositories).toHaveBeenCalledWith('testUser', 1, 9);
    expect(component.userProfile).toEqual(DUMMY_USER);
    expect(component.userRepositories).toEqual(DUMMY_REPOS);
  }));

  it('should handle user not found', fakeAsync(() => {
    apiService.getUser.and.returnValue(throwError({ status: 404 }));

    component.ngOnInit();
    tick();

    expect(component.errorMessage).toContain("User 'testUser' not found.");
    expect(apiService.getRepositories).not.toHaveBeenCalled();
  }));

  it('should not fetch repositories if user not found', fakeAsync(() => {
    apiService.getUser.and.returnValue(throwError({ status: 404 }));

    component.ngOnInit();
    tick();

    expect(apiService.getRepositories).not.toHaveBeenCalled();
  }));

  it('should handle other errors', fakeAsync(() => {
    apiService.getUser.and.returnValue(throwError('Some error'));

    component.ngOnInit();
    tick();

    expect(component.errorMessage).toContain(
      `Something went wrong! Please check your internet connection or again after some time.`
    );
    expect(apiService.getRepositories).not.toHaveBeenCalled();
  }));

  describe('Repositories test which require user beforehand', () => {
    const firstNineRepos = DUMMY_REPOS.slice(0, 9);
    const nextNineRepos = DUMMY_REPOS.slice(9, 18);

    beforeEach(fakeAsync(() => {
      apiService.getUser.and.returnValue(of(DUMMY_USER));
      apiService.getRepositories.and.returnValue(of(firstNineRepos));

      component.ngOnInit();
      tick();
    }));

    it('should fetch user repositories on page change', fakeAsync(() => {
      apiService.getRepositories.and.returnValue(of(nextNineRepos));
      component.onPageChange('next');
      tick();

      expect(apiService.getRepositories.calls.argsFor(1)).toEqual([
        'testUser',
        2,
        9,
      ]);
      expect(component.userRepositories).toEqual(nextNineRepos);
    }));

    it('should handle items change and fetch repositories', fakeAsync(() => {
      apiService.getRepositories.and.returnValue(of(nextNineRepos));

      component.itemsPerPage = 10;
      component.handleItemsChange();
      tick();

      expect(apiService.getRepositories.calls.argsFor(1)).toEqual([
        'testUser',
        1,
        10,
      ]);
      expect(component.userRepositories).toEqual(nextNineRepos);
    }));

    it('should handle previous page change correctly', fakeAsync(() => {
      apiService.getRepositories.and.returnValue(of(firstNineRepos));

      component.currentPage = 2;
      component.onPageChange('prev');
      tick();

      expect(apiService.getRepositories).toHaveBeenCalledWith('testUser', 1, 9);
      expect(component.userRepositories).toEqual(firstNineRepos);
    }));

    it('should set current page correctly on page change', () => {
      component.onPageChange(3);
      expect(component.currentPage).toBe(3);
    });

    it('should handle error in fetchUserRepositories', fakeAsync(() => {
      apiService.getUser.and.returnValue(of(DUMMY_USER));
      apiService.getRepositories.and.returnValue(throwError('Some error'));

      component.fetchUserRepositories();

      tick();

      expect(component.errorMessage).toContain(
        'Error fetching repositories. Please try again after some time.'
      );
      expect(apiService.getRepositories).toHaveBeenCalledWith('testUser', 1, 9);
    }));
  });
});
