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

  getCurrentUser(): Observable<UserDto | null> {
    return this.http.get<UserDto>(`${environment.apiUrl}/secured/users/currentUser`).pipe(
      map((res) => {this.userData.next(res);console.log('res', res); return res})
    );
  }
}
