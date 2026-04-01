import { Component, inject, OnInit, Signal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewCardService } from './view-card.service';
import { SettingHeaderService } from '../../components/setting-header.service';
import { TokenService } from '../../components/token.service';
import { DomainService } from '../../components/domain.service';
import { PopUpEntryService } from '../../components/pop-up-entry/pop-up-entry.service';

import { SkeletonModule } from 'primeng/skeleton';
import { ResumeComponent } from '../../components/cards/resume/resume.component';
import { VacancyComponent } from '../../components/cards/vacancy/vacancy.component';
import { ResumeService } from '../../components/personal-account/services/resume.service';
import { ErrorViewCardComponent } from '../../components/cards/error-view-card/error-view-card.component';
import { trigger, transition, style, animate } from '@angular/animations';
import {UserService} from "../../core/services/user.service";
import {resumeVacancyDto} from "../../core/models/resumeVacancyDto";
import {toSignal} from "@angular/core/rxjs-interop";
import {catchError, map, of} from "rxjs";

@Component({
  selector: 'app-view-vacancy',
  standalone: true,
  imports: [SkeletonModule, VacancyComponent, ResumeComponent, SkeletonModule, ErrorViewCardComponent],
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ViewCardComponent implements OnInit {

  imagePath: string = '';
  domainName: string = '';
  numberError!: number;
  visibleError: boolean = false;

  private route = inject(ActivatedRoute)
  private viewCardService = inject(ViewCardService);
  private userService = inject(UserService);
  private domainService = inject(DomainService);
  private settingHeaderService = inject(SettingHeaderService);
  private router = inject(Router);
  public tokenService = inject(TokenService);
  private popUpEntryService = inject(PopUpEntryService);
  private resumeService = inject(ResumeService);

  private id = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    ),
    { initialValue: 0 }
  );

  public typeCard: Signal<string> = toSignal(
    this.route.data.pipe(
      map(data => data['routeName'])
    )
  );

  public dataCard: Signal<resumeVacancyDto | null | undefined> = toSignal(this.viewCardService.getCardData(this.id(), this.typeCard()).pipe(
      catchError(error => {
        console.error('Ошибка загрузки:', error);
        this.visibleError = true;
        if (error.status == 404) {
          this.settingHeaderService.isheader = false;
          this.settingHeaderService.isFooter = false;
          this.numberError = error.status;
        } else {
          this.numberError = error.status;
          void this.router.navigate(['/error', { num: error.status }]);
        }
        return of(null);
      })
    )
  );

  public currentUser = toSignal(this.userService.getCurrentUser());

  constructor() {}

  ngOnInit(): void {
    this.settingHeaderService.shared = true;
    this.settingHeaderService.backbtn = true;

    this.domainService.checkImageExists(this.domainName).then((path) => {
      this.imagePath = path;
    });
  }

  onUserClick(event: MouseEvent): void {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    event.preventDefault();
    void this.router.navigate([``, this.dataCard()?.user.nickname]);
  }


  onProjectClick(event: MouseEvent): void {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    event.preventDefault();
    void this.router.navigate([`/project`, this.dataCard()?.projectDto.id]);
  }

  enter() {
    this.popUpEntryService.isAuth = true;
    this.popUpEntryService.accessVerification = false;
    this.popUpEntryService.confirmAuth = false;
    this.popUpEntryService.showDialog();
  }

  setArchive(event: Event) {
    event.stopPropagation();
    this.resumeService.toggleResumeArchive(this.dataCard());
    void this.router.navigate([`/myaccount`, this.dataCard()?.user.id]);
  }

  update(event: Event, id?: number) {
    event.stopPropagation();
    const userId = localStorage.getItem('userId')

    if (this.typeCard() === 'vacancy') {
      void this.router.navigate([`/myaccount/${userId}/updateVacancy/${id}`]);
    } else {
      void this.router.navigate([`/myaccount/${userId}/updateResume/${id}`]);
    }

  }
  getImageLink(): string | undefined {
    if (this.dataCard()?.projectDto) {
      return this.dataCard()?.projectDto.avatarLink;
    } else {
      return this.dataCard()?.user?.imageLink
    }
  }
}
