import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {environment} from "../../../environment";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {IHackathonDto} from "../models/hackathonDto";
import {IHackathonTeamMemberDto} from "../models/hackathonTeamMemberDto";
import {IUserRoles, UserDto} from "../models/userDto";
import {IProjectDto} from "../models/projectDto";

@Injectable({
  providedIn: 'root'
})
export class HackathonService {
  private http = inject(HttpClient);
  page: any = 'home';

  private currentHackathonIsOwnerSubject = new BehaviorSubject<boolean>(false);
  public currentHackathonIsOwner$: Observable<any> = this.currentHackathonIsOwnerSubject.asObservable();

  private currentHackathonDataSubject = new BehaviorSubject<IHackathonDto>({} as IHackathonDto);
  public currentHackathonData$: Observable<IHackathonDto> = this.currentHackathonDataSubject.asObservable();

  constructor() { }

  setCurrentHackathonOwnerSubject(data: boolean): void {
    this.currentHackathonIsOwnerSubject.next(data);
  }

  setCurrentHackathonData(data: IHackathonDto): void {
    this.currentHackathonDataSubject.next(data);
  }

  setCurrentHackathonOwner(data: IHackathonDto): void {
    const nicknameUser = localStorage.getItem('userNickname')
    if (data.creator && data.creator.nickname) {
      if(nicknameUser == data.creator.nickname){
        this.setCurrentHackathonOwnerSubject(true);
      }
    }
  }

  /* Hackathon */

  getCurrentHackathon(nickname: string): Observable<IHackathonDto> {
    return this.http.get<IHackathonDto>(`${environment.apiUrl}/main/hackathon/byNickname/${nickname}`).pipe(
      map(data => {
        this.setCurrentHackathonData(data);
        return data;
      }),
    )
  }

  createHackathon(data: IHackathonDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathons/add`, data)
  }

  editHackathon(data: IHackathonDto, id: number | string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathons/update/${id}`, data)
  }

  /* Team members */

  getAllTeamMembers(hackathonId: number): Observable<IHackathonTeamMemberDto[]> {
    return this.http.get<IHackathonTeamMemberDto[]>(`${environment.apiUrl}/team-members-hackathon/hackathon-project/${hackathonId}/all-team-members`);
  }

  addTeamMember(hackathonId: number, member: UserDto): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/team-members-hackathon/${hackathonId}/add-user`, member)
  }

  /* project hackathon */

  getAllHackathonProjects(hackathonId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/main/hackathon-project/${hackathonId}/all-projects`)
  }

  addProjectToHackathon(hackathonId: number, data: {hackathon: IHackathonDto, project: IProjectDto}): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathon-projects/${hackathonId}/add-project`, data)
  }

  /* Hackathon Participant Will */

  getAllWishingMembers(hackathonId: number): Observable<IHackathonTeamMemberDto[]> {
    return this.http.get<IHackathonTeamMemberDto[]>(`${environment.apiUrl}/hackathon-wishing/${hackathonId}/all-members`)
  }

  addWishingMember(hackathonId: number, data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathon-wishing/${hackathonId}/add-member`, data)
  }
}
