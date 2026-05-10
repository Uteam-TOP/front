import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environment";
import {Image} from "primeng/image";

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  private http = inject(HttpClient);

  constructor() { }

  addAchievement(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/achievement/add`, data);
  }

  addAchievementImage(image: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/achievement/add-image`, image)
  }

  getImageBlob(imageUrl: string): Observable<any> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  assignProjectAchievements(projectId: number, achievementId: number): Observable<any> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('achievementId', achievementId)
    return this.http.post(`${environment.apiUrl}/achievement/assign-project-achievement`, {}, {params})
  }
}
