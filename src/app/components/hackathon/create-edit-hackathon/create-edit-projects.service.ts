import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CreateEditProjectsService {

  constructor(private http: HttpClient) { }


  setNewProject(dataProject: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathons`, dataProject)
  }

  setEditProject(dataProject: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/hackathons/${dataProject.id}`, dataProject)
  }

  setAvatar(formData: any, dirDefaultAvatar: string, projectId: any): Observable<any> {
    let params = new HttpParams()
      .set('dirDefaultAvatar', dirDefaultAvatar)

    return this.http.put(`${environment.apiUrl}/hackathons/${projectId}/image`, formData, { params });
  }


}
