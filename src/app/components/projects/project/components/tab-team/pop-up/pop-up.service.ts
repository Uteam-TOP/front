import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, first, forkJoin} from 'rxjs';
import { NewPeopleService } from '../new-people/new-people.service';
import { ProjectService } from '../../../project.service';
import {MyTeamService} from "../mu-team/my-team.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private projectService = inject(ProjectService);
  private myTeamService = inject(MyTeamService);
  private router = inject(Router);

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSubject.asObservable();


  constructor(private http: HttpClient, private newPeopleService: NewPeopleService) { }


  showPopup() {
    this.visibleSubject.next(true);  // Устанавливаем значение true
  }

  hidePopup() {
    this.visibleSubject.next(false); // Устанавливаем значение false
  }

  private titleSubject = new BehaviorSubject<any>(null); // Изменено с '' на null
  titleCurrent$ = this.titleSubject.asObservable();

  setTitle(item: any) {
    this.titleSubject.next(item);  // Устанавливаем новое значение
  }


  private itemSubject = new BehaviorSubject<any>(null); // Изменено с '' на null
  itemCurrent$ = this.itemSubject.asObservable();

  setItem(item: any) {
    this.itemSubject.next(item);  // Устанавливаем новое значение
  }

  setDecline() {
    const item = this.itemSubject.value; // Получаем текущее значение
    if (item && item.id) {
      this.newPeopleService.setNewPeopleDecline(item.id).subscribe((value: any) => {
        console.log("value", value);
        this.hidePopup();
      });
    } else {
      console.warn("Item is not set");
    }
  }

  setApplication() {
    const item = this.itemSubject.value; // Получаем текущее значение
    const dataProject = this.projectService.getCurrentProjectData();

    if (dataProject && dataProject.id && item && item.id) {
      forkJoin({
        members: this.myTeamService.teamMembers$.pipe(first()),
        newMembers: this.newPeopleService.setApplication(dataProject.id, item.id)
      }).subscribe({
        next: (value) => {
          console.log("members", value);
          value.members.push(value.newMembers);
          this.myTeamService.updateTeamMembers(value.members);
          this.hidePopup();
        }
      })
      this.myTeamService.teamMembers$.subscribe(teamMembers => {
        console.log('teamMembers', teamMembers);
      });
    } else {
      console.warn("DataProject or item is not set");
    }


      // this.newPeopleService.setApplication(dataProject.id, item.id).subscribe((value: any) => {
      //   this.myTeamService.updateTeamMembers(value);
      //   this.hidePopup();
      //   this.router.navigate([`/project/${dataProject.nickname}`]);
      // });
  }

}
