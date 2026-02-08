import { HttpClient, HttpHeaders } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { TokenService } from '../../components/token.service';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ViewCardService {
  private http = inject(HttpClient);

  selectedCard: any;
  typeCard: string = '';

  getCardData(id: number, typeCard:string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/main/${typeCard}/${id}`);
  }

}
