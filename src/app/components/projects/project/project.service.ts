import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  activeTab: 'aboutProject' | 'tape' | 'myTeam' = 'aboutProject'
  activeTabSubject = new BehaviorSubject<'aboutProject' | 'tape' | 'myTeam'>('aboutProject');
  public currentActiveTab$: Observable<any> = this.activeTabSubject.asObservable();

  currentProjectDataSubject = new BehaviorSubject<any>(null);
  // Observable for project data
  public currentProjectData$: Observable<any> = this.currentProjectDataSubject.asObservable();


  private currentProjectIsOwnerSubject = new BehaviorSubject<boolean>(false);
  public currentProjectIsOwner$: Observable<any> = this.currentProjectIsOwnerSubject.asObservable();

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

  clearCurrentProjectData(): void {
    this.currentProjectDataSubject.next(null);
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
    console.log('currentProjectIsOwnerSubject', data)
    this.currentProjectIsOwnerSubject.next(data);
  }

  getCurrentProjectIsOwner(): any {
    return this.currentProjectIsOwnerSubject.getValue();
  }


  isEditProject: boolean = false;

  getCurrentProject(nicknameProject: string | number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const idType = !isNaN(nicknameProject as number) ? '' : 'by-nickname/'
    if(token){
      return this.http.get<any>(`${environment.apiUrl}/main/project/${idType}${nicknameProject}`, { headers })
    }else{
      return this.http.get<any>(`${environment.apiUrl}/main/project/${idType}${nicknameProject}`)
    }
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

  isUserResponded(projectId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/applications/has-current-user-responded-project/${projectId}`)
  }


}
