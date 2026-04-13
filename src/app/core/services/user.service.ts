import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "../../components/token.service";
import {environment} from "../../../environment";
import {UserDto} from "../models/userDto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private avatarUpdateTrigger = new BehaviorSubject<string>('');
  avatarUpdateTrigger$ = this.avatarUpdateTrigger.asObservable();

  private userData = new BehaviorSubject<UserDto>({} as UserDto);
  userData$ = this.userData.asObservable();

  updateAvatar(data: string) {
    this.avatarUpdateTrigger.next(data);
  }

  isAdmin(): Observable<boolean> {
    if (this.userData.getValue().id) {
      return this.userData$.pipe(
        map(data => {
          return !!data.roles.find(role => role.role === UserDto.RoleEnum.Admin
        )})
      )
    } else {
      return of(false);
    }

  }

  getCurrentUser(): Observable<UserDto | null> {
    return this.http.get<UserDto>(`${environment.apiUrl}/secured/users/currentUser`).pipe(
      map((res) => {this.userData.next(res); return res})
    );
  }

  getUserAchievements(userId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/achievement/all-achievements-by-user/${userId}`)
  }
}
