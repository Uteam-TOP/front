import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";
import {environment} from "../../../environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {IHackathonDto} from "../models/hackathonDto";
import {IHackathonTeamMemberDto} from "../models/hackathonTeamMemberDto";
import {UserDto} from "../models/userDto";
import {IProjectDto} from "../models/projectDto";
import {IHackathonMember, IHackathonNomination, IHackathonProject} from "../models/hackathons";

@Injectable({
  providedIn: 'root'
})
export class HackathonService {
  private http = inject(HttpClient);
  page: any = 'home';

  private currentHackathonIsOwnerSubject = new BehaviorSubject<boolean>(false);
  public currentHackathonIsOwner$: Observable<boolean> = this.currentHackathonIsOwnerSubject.asObservable();

  private currentHackathonDataSubject = new BehaviorSubject<IHackathonDto>({} as IHackathonDto);
  public currentHackathonData$: Observable<IHackathonDto> = this.currentHackathonDataSubject.asObservable();

  private updateHackathonSubject = new BehaviorSubject<any>(null);
  public updateHackathon$: Observable<any> = this.updateHackathonSubject.asObservable();

  constructor() { }

  setCurrentHackathonOwnerSubject(data: boolean): void {
    this.currentHackathonIsOwnerSubject.next(data);
  }

  setCurrentHackathonData(data: IHackathonDto): void {
    this.currentHackathonDataSubject.next(data);
  }

  updateHackathon(
    type: 'member' | 'project',
    operation: 'add' | 'delete',
    data: any,
    id: number = 0,
    hackathonId: number = 0,
  ): void {
    const dataObj = {type, id, operation, data, hackathonId};
    this.updateHackathonSubject.next(dataObj);
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

  editHackathon(data: IHackathonDto, id?: number): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathons/update/${id}`, data)
  }

  deleteHackathon(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/hackathons/${id}`)
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
      .pipe(map(data => this.updateHackathon('project', 'add', data, data.project.id, hackathonId)))
  }

  updateProjectOfHackathon(hackathonId: number, data: IHackathonProject): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathon-projects/${hackathonId}/update-project?hackathonProjectStatus=${data.hackathonProjectStatus}`, data)
      .pipe(map(data => this.updateHackathon('project', 'add', data, data.project.id, hackathonId)))
  }

  deleteProjectToHackathon(projectId: number, hackathonId?: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/hackathon-projects/${projectId}`)
      .pipe(map(data => this.updateHackathon('project', 'delete', {}, projectId)))
  }

  /* Hackathon Participant Will */

  getAllWishingMembers(hackathonId: number): Observable<IHackathonTeamMemberDto[]> {
    return this.http.get<IHackathonTeamMemberDto[]>(`${environment.apiUrl}/main/hackathon/${hackathonId}/all-members`)
  }

  addWishingMember(hackathonId: number, data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/hackathon-wishing/${hackathonId}/add-member`, data)
      .pipe(map(data => this.updateHackathon('member', 'add', data, data.id, hackathonId)))
  }

  updateWishingMember(hackathonId: number, data: IHackathonMember): Observable<any> {
    const params = new HttpParams().set('hackathonProjectStatus', data.hackathonProjectStatus)
    return this.http.post<any>(`${environment.apiUrl}/hackathon-wishing/${hackathonId}/update-member`, data, { params })
      .pipe(map(data => this.updateHackathon('member', 'add', data, data.id, hackathonId)))
  }

  deleteWishingMember(memberId: number, hackathonId?: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/hackathon-wishing/delete/${memberId}`)
      .pipe(map(data => this.updateHackathon('member', 'delete', {}, memberId)))
  }

  /* Hackathon nominations */

  addHackathonNomination(data: IHackathonNomination): Observable<any> {
    return this.http.post(`${environment.apiUrl}/nomination/create`, data)
  }

  getHackathonNominations(hackathonId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/main/nomination/hackathon/${hackathonId}`)
  }

  updateHackathonNomination(data: IHackathonNomination): Observable<any> {
    return this.http.post(`${environment.apiUrl}/nomination/update`, data)
  }
}
