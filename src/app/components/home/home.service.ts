import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, delay, Observable, Subject, take, takeUntil} from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, private router: Router) { }

  typeToggle: 'vacancy' | 'hackathon' | 'project' | 'resume' = 'vacancy';
  vacancies: any[] = [];
  resumes: any[] = [];
  loading: boolean = true;
  selectPage: number = 0;
  visibleNextPage: boolean = false;
  private themeSubject = new BehaviorSubject<string>(localStorage.getItem('theme') || 'light');
  activeTheme$ = this.themeSubject.asObservable();

  private typeToggleSubject = new BehaviorSubject<'vacancy' | 'hackathon' | 'project' | 'resume'>('vacancy');
  activeTypeToggle$ = this.typeToggleSubject.asObservable();

  private destroy$ = new Subject<void>();


  private domain = `${environment.apiUrl}`;

  changeTheme(theme: string) {
    this.themeSubject.next(theme);
  }

  changeType(type: 'vacancy' | 'hackathon' | 'project' | 'resume') {
    this.typeToggleSubject.next(type);
    this.typeToggle = type;
  }

  getCardData(type: string, page?: number, pageSize?: number, sort: 'creationDate_ASC' | 'creationDate_DESC' = 'creationDate_ASC'): Observable<any> {
    let savedFilters: any = {};
    const filters = sessionStorage.getItem('bodyFilters');

    if (typeof page === 'number') {
        this.selectPage = page;
    }
    if (filters) {
      savedFilters = JSON.parse(filters);
    } else {
      savedFilters = {
        "visibilities": ["EVERYBODY"]
      };
      this.saveFilters(savedFilters);
    }

    const size = pageSize ? pageSize : 100;

    const typeSort = localStorage.getItem('typeSort');
    const queryParams = `page=${this.selectPage}&size=${size}&sorts=${sort}`;

    return this.http.post(`${this.domain}/main/${type}/getAll?${queryParams}`, savedFilters).pipe( delay(300) );
  }

  getVacancies(pageSize: number) {
    this.getCardData('vacancy', 0, pageSize)
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(data => {
      if (data) {
        const filteredData = data.filter((vacancy: any) => vacancy.visibility !== "BAN");
        if (filteredData.length === 30) {
          this.visibleNextPage = true;
        } else {
          this.visibleNextPage = false;
        }

        this.selectPage = this.selectPage + 1;
        this.vacancies = [...this.vacancies, ...filteredData];
      }
      this.loading = false;
    })
  }

  getResumes(pageSize: number) {
    this.getCardData('resume', 0, pageSize)
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(data => {
      if (data) {
        const filteredData = data.filter((resume: any) => resume.visibility !== "BAN");
        if (filteredData.length === 30) {
          this.visibleNextPage = true;
        } else {
          this.visibleNextPage = false;
        }

        this.selectPage = this.selectPage + 1;
        this.resumes = [...this.resumes, ...filteredData];
      }
      this.loading = false;
    });
  }

  projects: any[] = [];

  getProject() {

    this.getCardProjects()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((data: any) => {
      if (data) {
        this.projects = [];
        const filteredData = data.filter((project: any) => project.visibility !== "BAN");
        this.visibleNextPage = filteredData.length === 30;

        this.selectPage = this.selectPage + 1;
        this.projects = [...this.projects, ...filteredData];
      }
      this.loading = false;
    });
  }


  hackathons: any = [];

  gethackathons() {
    this.getCardHackathons()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((data: any) => {
      if (data) {
        this.hackathons = [];
        if (data.length === 30) {
          this.visibleNextPage = true;
        } else {
          this.visibleNextPage = false;
        }

        this.selectPage = this.selectPage + 1;
        this.hackathons = [...this.hackathons, ...data];
      }
      this.loading = false;
    });
  }


  getCardProjects(page?: number, size: number = 100, sort: 'createdAt_ASC' | 'createdAt_DESC' = 'createdAt_ASC'): Observable<any[]> {
    if (typeof page === 'number') {
      this.selectPage = page;
    }

    const queryParams = `page=${this.selectPage}&size=${size}&sorts=${sort}`;

    return this.http.post<any[]>(`${this.domain}/main/project/get-by-filter?${queryParams}`, {});

  }

    getCardHackathons(page?: number, size: number = 100): Observable<any> {
    if (typeof page === 'number') {
      this.selectPage = page;
    }
    const queryParams = `page=${this.selectPage}&size=${size}`;

    return this.http.get(`${this.domain}/main/hackathons?${queryParams}`,).pipe(delay(300));
  }

  getNewsData(page: number, size: number = 10): Observable<any> {
    if (typeof page === 'number') {
      this.selectPage = page;
    }
    const queryParams = `page=${this.selectPage}&size=${size}`;

    return this.http.get(`${this.domain}/main/project/all-posts?${queryParams}`,).pipe(delay(300));
  }


  nextPage() {
    if (this.typeToggle === 'vacancy') {
      this.getVacancies(10);
    }
    if (this.typeToggle === 'resume') {
      this.getResumes(10);
    }
  }

  searchCards() {
    this.selectPage = 0;
    this.vacancies = [];
    this.resumes = [];
    if (this.typeToggle === 'vacancy') {
      this.getVacancies(100);
    }
    if (this.typeToggle === 'resume') {
      this.getResumes(100);
    }
  }


  saveFilters(filters: any): void {
    sessionStorage.setItem('bodyFilters', JSON.stringify(filters));
    this.selectPage = 0;
    this.vacancies = [];
    this.resumes = [];
  }

  clearFilters(): void {
    sessionStorage.removeItem('bodyFilters');
  }

  // toggleSortDirection(): void {
  //   let currentSort = localStorage.getItem('typeSort');
  //   if (currentSort) {
  //     currentSort = currentSort === 'creationDate_desc' ? 'creationDate' : 'creationDate_desc';
  //   } else {
  //     currentSort = 'creationDate_desc';
  //   }
  //   localStorage.setItem('typeSort', currentSort);
  // }

  toggleSort(sortItem: string): void {
    localStorage.setItem('typeSort', sortItem);
    this.loading = true;
    this.selectPage = 0;
    this.resumes = [];
    this.vacancies = [];
    this.projects = [];
    if (this.typeToggle === 'vacancy') {
      this.getVacancies(100);
    }
    if (this.typeToggle === 'resume') {
      this.getResumes(100);
    }

  }

  saveSort(sort: string): void {
    localStorage.setItem('sort', sort);
  }


  loadData() {
    // this.toggleSortDirection();
    if (this.typeToggle === 'vacancy') {
      this.getVacancies(10);
    }
    if (this.typeToggle === 'resume') {
      this.getResumes(10);
    }
    this.loading = false;
  }

  toggleType(type: any) {
    // this.typeToggleSubject.next(type);
    this.typeToggle = type;
    this.loading = true;
    this.selectPage = 0;
    // this.resumes = [];
    // this.vacancies = [];
    // this.projects = [];
    // this.hackathons = [];
    // if (type === 'vacancy') {
    //   this.getVacancies(10);
    // }
    // if (type === 'resume') {
    //   this.getResumes(10);
    // }
    // if (type === 'project') {
    //   this.getProject();
    // }
    // if (type === 'hackathon') {
    //   this.gethackathons();
    // }
    // if (type === 'news') {
    //
    // }
  }

  destroyHomeService() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
