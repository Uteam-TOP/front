import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {Navigation} from "swiper/modules";
import {ProjectComponent} from "../project/project.component";
import { ResumeLibraryComponent, VacancyLibraryComponent } from '../../../../common-uteam-library';
import {SwiperOptions} from "swiper/types";
import { SwiperContainer } from 'swiper/element';
import {HackathonCadComponent} from "../hackathon-cad/hackathon-cad.component";
import {VacancyComponent} from "../../view-card/vacancy/vacancy.component";

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ProjectComponent,
    VacancyLibraryComponent,
    ResumeLibraryComponent,
    HackathonCadComponent,
    VacancyComponent
  ],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeSliderComponent implements AfterViewInit {
  @ViewChild('prev', { read: ElementRef }) prev!: ElementRef;
  @ViewChild('next', { read: ElementRef }) next!: ElementRef;
  @ViewChild('swiper') swiperComp!: ElementRef<SwiperContainer>;

  @Input() items: any[] = [];
  @Input() type: 'project' | 'vacancy' | 'resume' | 'hackathon' = 'project';

  private router = inject(Router);

  resumeVisibleSections: string[] = ['profession', 'availability', 'skills', 'motivations', 'profile']

  navigation: any = {};

  constructor() {
    console.log('init home-slider')
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
    console.log(swiper)
  }

  protected readonly Navigation = Navigation;
}
