import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Observable} from "rxjs";
import {IDiscussionPostDto} from "../models/discussionDto";

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {
  private http = inject(HttpClient);

  constructor() { }

  addPost(data: IDiscussionPostDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/discussion-post/add`, data);
  }
}
