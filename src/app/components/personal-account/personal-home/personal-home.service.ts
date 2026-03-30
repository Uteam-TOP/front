import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalHomeService {

  constructor(private http: HttpClient) { }

  private domain = `${environment.apiUrl}`;
  getCardsData(typeCard: string): Observable<any> {
    return this.http.get(`${this.domain}/${typeCard}/ofCurrentUser`);
  }

  getHackathonsCardData(): Observable<any> {
    return this.http.get(`${this.domain}/hackathons/all-hackathons/current-user`);
  }


}
