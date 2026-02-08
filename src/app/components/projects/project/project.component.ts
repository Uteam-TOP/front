import {Component, effect, inject, OnInit, Signal} from '@angular/core';
import { TeamComponent } from './components/team/team.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { AboutProjectComponent } from './components/about-project/about-project.component';
import { ProjectService } from './project.service';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { PopUpResponseTeamService } from './components/pop-up-response-team/pop-up-response-team.service';
import { PopUpResponseTeamComponent } from './components/pop-up-response-team/pop-up-response-team.component';
import { TapeComponent } from './components/tape/tape.component';
import { ScreensaverComponent } from './components/screensaver/screensaver.component';
import { ActivatedRoute } from '@angular/router';
import { ArchiveVacanciesComponent } from './components/archive-vacancies/archive-vacancies.component';
import { TabTeamComponent } from './components/tab-team/tab-team.component';
import { ScreensaverPhoneComponent } from './components/screensaver-phone/screensaver-phone.component';
import { PersonalDataService } from '../../personal-account/personal-data/personal-data.service';
import { TokenService } from '../../token.service';
import {combineLatest, map, of} from 'rxjs';
import {TagComponent} from "../../../shared/ui-components/tag/tag.component";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ScreensaverPhoneComponent, TabTeamComponent, TeamComponent, AboutProjectComponent, VacanciesComponent, ReviewsComponent, PopUpResponseTeamComponent, TapeComponent, ScreensaverComponent, ArchiveVacanciesComponent, TagComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  projectService = inject(ProjectService);
  private popUpResponseTeamService = inject(PopUpResponseTeamService);
  private route = inject(ActivatedRoute);
  private personalDataService = inject(PersonalDataService);
  private tokenService = inject(TokenService);

  showTagBlock = false;
  selectedTags: any[] = [];
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  cardItem: any = {
    profession: 'Директор по информационным технологиям (CIO)'
  }

  tags: any[] = [
    { id: 1, name: 'Стартап', nameEng: '', competenceLevel: null, type: 'STARTUP' },
    { id: 2, name: 'Компания', nameEng: '', competenceLevel: null, type: 'COMPANY' },
    { id: 3, name: 'Разовый проект', nameEng: '', competenceLevel: null, type: 'ONE_TIME_PROJECT' },
  ];


  private paramId: Signal<string | number | null> = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: '' }
  );

  projectData = toSignal(this.projectService.getCurrentProject(this.paramId()));
  detailsListProject: { 'title': string, 'context': string }[] | null = null;
  isOwner = toSignal(this.projectService.currentProjectIsOwner$, { requireSync: true });
  isPopupVisible = toSignal(this.popUpResponseTeamService.visible$, { requireSync: true });
  showUserRespondedMessage: boolean = false;
  activeTab = toSignal(this.projectService.currentActiveTab$, { requireSync: true });

  constructor() {
    effect(() => {
      const projectData = this.projectData();
      if (projectData) {
        this.projectService.setCurrentProjectData(projectData);
        this.detailsListProject = [
          { title: 'Описание', context: projectData.description || 'Нет данных' },
          { title: 'Этап развития', context: projectData.developmentStage || 'Нет данных' },
          { title: 'Задачи', context: projectData.tasks || 'Нет данных' },
        ];
      }
    })
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      // ✅ Теперь ждем загрузки `projectData` перед вызовом `getCurrentUser`
      combineLatest([
        this.projectService.currentProjectData$,
        this.personalDataService.getCurrentUser(),
      ]).subscribe(([projectData, visible]) => {
        if (!projectData) {
          console.warn('Project data is missing');
          setTimeout(() => {
            this.projectService.setCurrentProjectIsOwner(false);
          });

          return;
        }

        let nickname = localStorage.getItem('userNickname');

        if (projectData.owner) {
          if (visible.nickname === projectData.owner.nickname) {
            setTimeout(() => {
              this.projectService.setCurrentProjectIsOwner(true);
            });
          } else {
            setTimeout(() => {
              this.projectService.setCurrentProjectIsOwner(false);
            });
          }
        } else {
          console.warn('Owner data is missing');
          setTimeout(() => {
            this.projectService.setCurrentProjectIsOwner(false);
          });
        }
      },
      (error) => {
        setTimeout(() => {
          this.projectService.setCurrentProjectIsOwner(false);
        });
        this.tokenService.clearToken();
        localStorage.removeItem('Linkken');
        localStorage.removeItem('fullAccess');
        localStorage.removeItem('userNickname');
      });
    } else {
      setTimeout(() => {
        this.projectService.setCurrentProjectIsOwner(false);
      });
    }

    // const imageUrl =
    //   'https://s3-alpha-sig.figma.com/img/1794/ba72/32c521779550b3739252f0a0fa851e85?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ThIZOtZLeGKH4-q0ljiIalrTJMAMWdAjTdo8smUxwUkli0I7kR5FSieo-PW-ZZ2D2Lq7284lOFICZwOVSM1K2AJ7g487SO9LYygzKe5l6-uzkHOOadpHltpoyVdDfXPGXGTX~tkAAeCgtGigpBYGNJDDnjpRuSYq6z3B1zExkAgXmBBMGVdgpOfVxL9VLM4RPAQyzSlZm4g8oXbP5NSJkPA49lOF-q8TNfa9WQkZYkc~oqHMbVWn-8G1MKxf7ftMtbroqfLivnfkpSmC7CutO7Er18fjDumIiR1XsnI5Vx7F9Wi6Mtz7GvJs~wSj8PnrcYhNuu1l~4cL6YELrEVbOQ__';
    // const overlayElement = document.querySelector('.overlay') as HTMLElement;
    //
    // if (overlayElement) {
    //   overlayElement.style.backgroundImage = `url(${imageUrl})`;
    //   overlayElement.style.backgroundSize = 'cover';
    //   overlayElement.style.backgroundPosition = 'center';
    // }

    // this.projectService.currentActiveTab$.subscribe(
    //   result => {
    //     if (result === 'tape') {
    //       this.setActiveTab('tape');
    //       console.log('tape');
    //     }
    //   }
    // )
  }

  setActiveTab(tab: 'aboutProject' | 'tape') {
    this.projectService.setActiveTab(tab);
  }

  toggleTagBlock(show: boolean) {
    setTimeout(() => {
      this.showTagBlock = show;
    }, 200);
  }

  value: any
  selectTag(tag: any) {
    if (!this.selectedTags.includes(tag) && this.selectedTags.length < 1) {
      this.onChange(tag);
      this.value = tag.name;
    }
  }

  getSelectedTagsText(): string {
    return this.selectedTags.map(tag => tag.name).join(', ');
  }
}
