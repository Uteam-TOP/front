import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  inject,
  Input, OnInit,
  ViewChild
} from '@angular/core';

import {Router, RouterLink} from "@angular/router";
import {Navigation} from "swiper/modules";
import {ProjectComponent} from "../project/project.component";
import { ResumeLibraryComponent, VacancyLibraryComponent } from '../../../../common-uteam-library';
import {SwiperOptions} from "swiper/types";
import { SwiperContainer } from 'swiper/element';
import {HackathonCadComponent} from "../hackathon-cad/hackathon-cad.component";
import {VacancyComponent} from "../../cards/vacancy/vacancy.component";
import {SkeletonBlockComponent} from "../../../shared/ui-components/skeleton-block/skeleton-block.component";
import {ProjectsNewsComponent} from "../../cards/projects-news/projects-news.component";
import {SortByPipe} from "../../../shared/pipes/sort-by.pipe";
import {ProjectService} from "../../projects/project/project.service";
import {PostDto} from "../../../core/models/postDto";

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [
    ProjectComponent,
    VacancyLibraryComponent,
    ResumeLibraryComponent,
    HackathonCadComponent,
    VacancyComponent,
    SkeletonBlockComponent,
    ProjectsNewsComponent,
    SortByPipe,
    RouterLink
],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeSliderComponent implements AfterViewInit, OnInit {
  @ViewChild('prev', { read: ElementRef }) prev!: ElementRef;
  @ViewChild('next', { read: ElementRef }) next!: ElementRef;
  @ViewChild('swiper') swiperComp!: ElementRef<SwiperContainer>;

  @Input() items: any[] = [];
  @Input() type: 'project' | 'vacancy' | 'resume' | 'hackathon' | 'news' = 'project';

  private projectService = inject(ProjectService);

  private router = inject(Router);
  isDesktop: boolean = true;
  isTablet: boolean = false;
  isMobile: boolean = false;

  emptyCards = [1, 2, 3, 4];

  resumeVisibleSections: string[] = ['profession', 'availability', 'skills', 'motivations', 'profile']

  navigation: any = {};

  constructor() {
    this.updateView(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateView(event.target.innerWidth);
  }

  ngOnInit() {
    this.items = this.items.sort((a, b) => a.id - b.id);
  }

  getCardUrl(cardValue: any, type: string, route: string): string {
    localStorage.setItem('routeTypeCard', type);
    if (type === 'news') {
      return this.router.createUrlTree(['project', cardValue.project.id]).toString();
    }
    if (type === 'project') {
      return this.router.createUrlTree(['project', cardValue.nickname]).toString();
    }
    return this.router.createUrlTree([route, cardValue.id]).toString();
  }

  onCardClick(event: MouseEvent, card: PostDto, type: string): void {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    if (type === 'news') {
      void this.router.navigate([`/project`, card.project?.nickname, 'post', card.id]);
      // this.projectService.setActiveTab('tape');
    } else {
      this.projectService.setActiveTab('aboutProject');
    }
    // event.preventDefault();
    // this.router.navigate([`/${type}`, cardId]);
  }

  ngAfterViewInit() {
    this.navigation = {
      prevEl: this.prev.nativeElement,
      nextEl: this.next.nativeElement
    };

    const swiper = this.swiperComp.nativeElement.swiper;
    if (swiper && swiper.params.navigation && swiper.navigation) {
      // @ts-ignore
      swiper.params.navigation.prevEl = this.prev.nativeElement;
      // @ts-ignore
      swiper.params.navigation.nextEl = this.next.nativeElement;
      swiper.navigation.init();
      swiper.navigation.update();
    }
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

  protected readonly Navigation = Navigation;
}
