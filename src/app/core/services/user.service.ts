import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private avatarUpdateTrigger = new BehaviorSubject<string>('');
  avatarUpdateTrigger$ = this.avatarUpdateTrigger.asObservable();

  updateAvatar(data: string) {
    this.avatarUpdateTrigger.next(data);
  }

  constructor() { }
}
