import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {IProjectDto} from "../../../../../core/models/projectDto";
import {environment} from "../../../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  private selectedProjectSubject = new BehaviorSubject<number | null>(null);
  selectedProject$ = this.selectedProjectSubject.asObservable();

  selectProject(project: number | null): void {
    this.selectedProjectSubject.next(project);
  }

  getProjectData(projectId: number | null): Observable<IProjectDto> {
    return this.http.get<IProjectDto>(`${environment.apiUrl}/main/project/${projectId}`);
  }

}

