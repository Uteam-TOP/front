import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { environment } from '../../../../environment';
import {IProjectDto, ProjectDto} from "../../../core/models/projectDto";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  activeTab: 'aboutProject' | 'tape' | 'myTeam' = 'aboutProject'
  activeTabSubject = new BehaviorSubject<'aboutProject' | 'tape' | 'myTeam'>('aboutProject');
  public currentActiveTab$: Observable<'aboutProject' | 'tape' | 'myTeam'> = this.activeTabSubject.asObservable();

  currentProjectDataSubject = new BehaviorSubject<IProjectDto>({} as IProjectDto);
  // Observable for project data
  public currentProjectData$: Observable<IProjectDto> = this.currentProjectDataSubject.asObservable();


  private currentProjectIsOwnerSubject = new BehaviorSubject<boolean>(false);
  public currentProjectIsOwner$: Observable<boolean> = this.currentProjectIsOwnerSubject.asObservable();

  setActiveTab(tab: 'aboutProject' | 'tape' | 'myTeam'): void {
    this.activeTabSubject.next(tab);
  }
  // Method to update the project data
  setCurrentProjectData(data: any): void {
    this.currentProjectDataSubject.next(data);
  }

  // Method to get the latest project data
  getCurrentProjectData(): any {
    return this.currentProjectDataSubject.getValue();
  }

  // Метод для изменения поля currentUserAppliedToProject на true
  updateUserAppliedStatus(): void {
    const currentData = this.getCurrentProjectData();

    if (currentData) {
      currentData.currentUserAppliedToProject = true;
      this.setCurrentProjectData(currentData);
    } else {
      console.warn('Данные проекта или поле currentUserAppliedToProject не найдены');
    }
  }



  private currentProjectVacanciesSubject = new BehaviorSubject<any>(null);

  public currentProjectVacancies$: Observable<any> = this.currentProjectVacanciesSubject.asObservable();

  setCurrentProjectVacancies(data: any): void {
    this.currentProjectVacanciesSubject.next(data);
  }

  getCurrentProjectVacancies(): any {
    return this.currentProjectVacanciesSubject.getValue();
  }

  clearCurrentProjectVacancies(): void {
    this.currentProjectVacanciesSubject.next(null);
  }

  setCurrentProjectIsOwner(data: boolean): void {
    this.currentProjectIsOwnerSubject.next(data);
  }

  getCurrentProjectIsOwner(): any {
    return this.currentProjectIsOwnerSubject.getValue();
  }


  isEditProject: boolean = false;

  getCurrentProject(nicknameProject?: string | number | null): Observable<IProjectDto> {
    const idType = !isNaN(nicknameProject as number) ? '' : 'by-nickname/'
    return this.http.get<IProjectDto>(`${environment.apiUrl}/main/project/${idType}${nicknameProject}`)
  }


  getVacanciesProject(idProject: string): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const filters = {

    }

    return this.http.post<any>(`${environment.apiUrl}/main/project/${idProject}/vacancies/get-by-filter?page=0&size=100`, filters, { headers })

  }

  likeProject(id: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/projects/${id}/like`, {})
  }

  likePost(id: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${id}/like`, {})
  }

  isUserResponded(projectId?: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/applications/has-current-user-responded-project/${projectId}`)
  }


}
