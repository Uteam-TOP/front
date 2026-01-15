import { CommonModule } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { ParticipantComponent } from './participant/participant.component';
import { PopUpResponseTeamService } from '../pop-up-response-team/pop-up-response-team.service';
import { JobComponent } from './job/job.component';
import { ProjectService } from '../../project.service';
import { TeamService } from './team.service';
import {catchError, concatMap, first, map, mergeMap, of, switchMap, take} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, ParticipantComponent, JobComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {


  itemsList = []

  vacancies: any;
  currentProjectData: any;
  isOwner: boolean = false;
  projectService = inject(ProjectService);

  constructor(private popUpResponseTeamService: PopUpResponseTeamService, private teamService: TeamService) { }

  ngOnInit(): void {

    this.projectService.currentProjectIsOwner$
      .subscribe((value: boolean) => {
      this.isOwner = value;
    })

    this.projectService.currentProjectVacancies$.subscribe((data: any) => {
      this.vacancies = data;
    })
    this.projectService.currentProjectData$
      .pipe(
        filter(project => !!project && !!project.id),
        concatMap(currentProjectResult => {
          return this.projectService.isUserResponded(currentProjectResult.id).pipe(
            map(userRespondedResult => ({currentProjectResult, userRespondedResult})),
            catchError(err => {
              console.error('Ошибка в запросе isUserResponded:', err);
              return of({ currentProjectResult, userRespondedResult: null });
            })
          )
        })
      )
      .subscribe(({currentProjectResult, userRespondedResult}) => {
      this.currentProjectData = currentProjectResult;
      console.log('currentProjectData', this.currentProjectData);
      if (currentProjectResult != null) {
        this.teamService.getTeamProject(this.currentProjectData?.id).subscribe((value: any) => {
          this.itemsList = value;
        })
      }

      this.isOwner = userRespondedResult;
    })
  }

  // checkUserResponded() {
  //   this.projectService.isUserResponded(this.currentProjectData.id).subscribe((value: any) => {
  //
  //   })
  // }

  checkUserInTeam(itemsList: any[]): boolean {
    // Получаем данные пользователя из sessionStorage
    const userNickname = localStorage.getItem('userNickname');
    if (!userNickname) {
      console.warn('Пользователь не авторизован!');
      return false;
    }

    return itemsList.some(item => item.user?.nickname === userNickname);
  }



  getPopUoP() {
    this.popUpResponseTeamService.showPopup()
  }

  setActiveTab() {
    this.projectService.activeTab = 'myTeam';
  }


}

