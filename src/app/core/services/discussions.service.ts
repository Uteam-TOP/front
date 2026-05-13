import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environment";
import {Observable} from "rxjs";
import {IDiscussionComment, IDiscussionPostDto} from "../models/discussionDto";

@Injectable({
  providedIn: 'root'
})
export class DiscussionsService {
  private http = inject(HttpClient);

  constructor() { }

  addPost(data: IDiscussionPostDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/discussion-post/add`, data);
  }

  getAllPosts(page: number, pageSize: number): Observable<IDiscussionPostDto[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', pageSize)
    return this.http.get<IDiscussionPostDto[]>(`${environment.apiUrl}/main/discussion-post/all-discussion-posts`, {params});
  }

  getPost(postId: number): Observable<IDiscussionPostDto> {
    return this.http.get<IDiscussionPostDto>(`${environment.apiUrl}/main/discussion-post/${postId}`)
  }

  likePost(postId: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/discussion-post/${postId}/like`, {});
  }

  dislikePost(postId: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/discussion-post/${postId}/dislike`, {});
  }

  getPostComments(postId: number): Observable<IDiscussionComment[]> {
    return this.http.get<IDiscussionComment[]>(`${environment.apiUrl}/main/discussion-post-comment/${postId}`)
  }

  addComment(data: IDiscussionComment): Observable<IDiscussionComment> {
    return this.http.post<IDiscussionComment>(`${environment.apiUrl}/discussion-post-comment/add`, data);
  }

  likeComment(commentId: number): Observable<number> {
    return this.http.put<number>(`${environment.apiUrl}/discussion-post-comment/${commentId}/like`, {});
  }

  dislikeComment(commentId: number): Observable<number> {
    return this.http.put<number>(`${environment.apiUrl}/discussion-post-comment/${commentId}/dislike`, {});
  }
}
