import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class NewApplicationService {

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/resumes/ofCurrentUser`)
  }

  getCurrentProjects(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/projects/userProfile`)
  }
}
