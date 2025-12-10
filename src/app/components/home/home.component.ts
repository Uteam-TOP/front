import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  OnInit, viewChild, ViewChild, ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundImgsComponent } from '../background-imgs/background-imgs.component';
import { SearchComponent } from './search/search.component';
import { SortetdFilterComponent } from './sortetd-filter/sortetd-filter.component';
import { ViewCardService } from '../view-card/view-card.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { SettingHeaderService } from '../setting-header.service';
import { HomeService } from './home.service';
import { OneSectionComponent } from './one-section/one-section.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { SearchInputPhoneComponent } from './search/search-input-phone/search-input-phone.component';
import { ResumeLibraryComponent, VacancyLibraryComponent } from '../../../common-uteam-library';
import { ProjectComponent } from './project/project.component';
import { HackathonCadComponent } from './hackathon-cad/hackathon-cad.component';
import { HttpClient } from '@angular/common/http';
import { PopUpEntryService } from '../pop-up-entry/pop-up-entry.service';
import { environment } from '../../../environment';
import { TokenService } from '../token.service';
import { PopUpEntryComponent } from '../pop-up-entry/pop-up-entry.component';
import {Navigation} from "swiper/modules";
import {HomeSliderComponent} from "./home-slider/home-slider.component";
import {UiButtonComponent} from "../../shared/ui-components/ui-button/ui-button.component";
import {SkeletonBlockComponent} from "../../shared/ui-components/skeleton-block/skeleton-block.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, OneSectionComponent, BackgroundImgsComponent, SearchComponent, SortetdFilterComponent, SearchInputPhoneComponent, VacancyLibraryComponent, ResumeLibraryComponent, ProjectComponent, HackathonCadComponent, HomeSliderComponent, UiButtonComponent, RouterLink, SkeletonBlockComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PopUpEntryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
export class HomeComponent implements OnInit {

  @ViewChild('projects') ProjectsDiv!: ElementRef;
  @ViewChild('hackathons') HackathonsDiv!: ElementRef;
  @ViewChild('vacancies') VacanciesDiv!: ElementRef;
  @ViewChild('resumes') ResumesDiv!: ElementRef;

  loading: boolean = true;
  isVisibleFilter: boolean = false;

  isDesktop = false;
  isTablet = false;
  isMobile = false;
  resumeVisibleSections: string[] = ['profession', 'availability', 'skills', 'motivations', 'profile']
  scrollTimeout: any;

  navigation: any = {};

  constructor(
    private viewCardService: ViewCardService,
    public settingHeaderService: SettingHeaderService,
    private router: Router,
    public homeService: HomeService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private tokenService: TokenService,
    private popUpEntryService: PopUpEntryService,
    private popUpEntryComponent: PopUpEntryComponent
  ) {
    this.settingHeaderService.post = false;
    this.settingHeaderService.shared = false;
    this.settingHeaderService.backbtn = false;
  }

  userId!: number;

  @HostListener('document:scroll', ['$event'])
  public onViewportScroll() {
    const windowHeight = window.innerHeight;
    const boundingRectProjects = this.ProjectsDiv.nativeElement.getBoundingClientRect();
    const boundingRectHackathons = this.HackathonsDiv.nativeElement.getBoundingClientRect();
    const boundingRectVacancy = this.VacanciesDiv.nativeElement.getBoundingClientRect();
    const boundingRectResumes = this.ResumesDiv.nativeElement.getBoundingClientRect();

    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {

      if (boundingRectProjects.top >= 0 && boundingRectProjects.bottom - 500 <= windowHeight) {
        // this.homeService.changeType('project');
        this.homeService.typeToggle = 'project';
      }

      if (boundingRectHackathons.top >= 0 && boundingRectHackathons.bottom - 500 <= windowHeight) {
        if (!this.homeService.hackathons.length && !this.homeService.loading) {
          this.homeService.toggleType('hackathon');
        }
        // this.homeService.changeType('hackathon');
        this.homeService.typeToggle = 'hackathon';
      }

      if (boundingRectVacancy.top >= 0 && boundingRectVacancy.bottom - 500 <= windowHeight) {
        if (!this.homeService.vacancies.length && !this.homeService.loading) {
          this.homeService.toggleType('vacancy');
        }
        // this.homeService.changeType('vacancy');
        this.homeService.typeToggle = 'vacancy';
      }

      if (boundingRectResumes.top >= 0 && boundingRectResumes.bottom - 400 <= windowHeight) {
        if (!this.homeService.resumes.length && !this.homeService.loading) {
          this.homeService.toggleType('resume');
        }
        // this.homeService.changeType('resume');
        this.homeService.typeToggle = 'resume';
      }

    }, 50)
  }

  ngOnInit() {
    this.homeService.toggleType('project');
    this.settingHeaderService.isFilterState$.subscribe(value => {
      this.isVisibleFilter = value;
    });
    this.homeService.loadData();
    this.updateView(window.innerWidth);

    this.route.params.subscribe(params => {
      this.userId = +params['idUser'];
      this.verifyProfile();
    });

    this.homeService.activeTypeToggle$.subscribe((value: 'vacancy' | 'hackathon' | 'project' | 'resume') => {
      let element;
      if (value === 'vacancy') {
        element = this.VacanciesDiv.nativeElement;
      } else if (value === 'hackathon') {
        element = this.HackathonsDiv.nativeElement;
      } else if (value === 'project') {
        element = this.ProjectsDiv.nativeElement;
      } else if (value === 'resume') {
        element = this.ResumesDiv.nativeElement;
      } else {
        element = this.ProjectsDiv.nativeElement;
      }
      this.scrollToSection(element, true)
    })
  }

  scrollToSection(element: HTMLElement, smooth: boolean = true) {
    element.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center'});
  }

  verifyProfile(): void {
    if (!this.userId || isNaN(this.userId)) {
      console.error('Invalid user ID:', this.userId);
      this.loading = false;
      return;
    }

    this.loading = true;
    this.http.get(`${environment.apiUrl}/auth/token/${this.userId}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.popUpEntryService.confirmAuth = true;
          this.popUpEntryService.accessVerificationMessage = "Аккаунт успешно подтвержден";
          this.popUpEntryService.showDialog();
          this.popUpEntryComponent.login_user();
        },
        error: (error) => {
          this.loading = false;

          if (error.status === 208) {
            this.popUpEntryService.accessVerificationMessage = "Аккаунт уже подтвержден ранее";
            this.popUpEntryService.showDialog();
          } else if (error.status === 404) {
            this.popUpEntryService.accessVerificationMessage = "Пользователь не найден";
            this.popUpEntryService.showDialog();
          } else {
            this.popUpEntryService.accessVerificationMessage = "Произошла ошибка при подтверждении";
            this.popUpEntryService.showDialog();
          }
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateView(event.target.innerWidth);
  }

  updateView(width: number): void {
    if (width >= 1024) {
      this.isDesktop = true;
      this.isTablet = false;
      this.isMobile = false;
    } else if (width >= 768 && width < 1024) {
      this.isDesktop = false;
      this.isTablet = true;
      this.isMobile = false;
    } else {
      this.isDesktop = false;
      this.isTablet = false;
      this.isMobile = true;
    }
  }

  getCardUrl(cardValue: any, type: string, route: string): string {
    localStorage.setItem('routeTypeCard', type);
    return this.router.createUrlTree([route, cardValue]).toString();
  }


  onCardClick(event: MouseEvent, cardId: any, type: string): void {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    event.preventDefault();
    this.router.navigate([`/${type}`, cardId]);
  }


  nextPage() {
    this.homeService.nextPage()
  }

  protected readonly Navigation = Navigation;
}
