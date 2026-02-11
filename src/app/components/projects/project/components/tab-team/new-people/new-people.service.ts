import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewPeopleService {

  constructor(private http: HttpClient) { }

  getNewPeopleService(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/main/project/${id}/applications/getByFilter?page=0&size=100`, {})
  }

  setNewPeopleDecline(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/applications/${id}/decline`)
  }

  setApplication(projectId: any, applicationId: any) {
    return this.http.post<any>(`${environment.apiUrl}/projects/${projectId}/teamMembers?applicationId=${applicationId}`, { })
  }

}
