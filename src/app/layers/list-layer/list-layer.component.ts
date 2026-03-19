import {ChangeDetectionStrategy, Component, HostListener, inject, Input, OnInit} from '@angular/core';
import {UiButtonComponent} from "../../shared/ui-components/ui-button/ui-button.component";
import {ProjectComponent} from "../../components/home/project/project.component";
import { ResumeLibraryComponent, } from '../../../common-uteam-library';
import {Router, RouterLink} from "@angular/router";
import {VacancyComponent} from "../../components/cards/vacancy/vacancy.component";
import {NotFoundComponent} from "../not-found/not-found.component";
import {HackathonCadComponent} from "../../components/home/hackathon-cad/hackathon-cad.component";
import {ProjectsNewsComponent} from "../../components/cards/projects-news/projects-news.component";
import {PostDto} from "../../core/models/postDto";
import {ProjectService} from "../../components/projects/project/project.service";

@Component({
  selector: 'app-list-layer',
  standalone: true,
  imports: [
    UiButtonComponent,
    ProjectComponent,
    ResumeLibraryComponent,
    ResumeLibraryComponent,
    VacancyComponent,
    NotFoundComponent,
    HackathonCadComponent,
    ProjectsNewsComponent,
    RouterLink
  ],
  templateUrl: './list-layer.component.html',
  styleUrl: './list-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLayerComponent implements OnInit {
  @Input() cards: any[] = [];
  @Input() type: 'project' | 'vacancy' | 'resume' | 'hackathon' | 'news' = 'project';

  private router = inject(Router);
  private projectService = inject(ProjectService);

  isMobile = false;

  resumeVisibleSections: string[] = ['profession', 'availability', 'skills', 'motivations', 'profile']

  public sortBy = 'createdAt';
  public sortType: 'desc' | 'asc' = 'desc';

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateView(event.target.innerWidth);
  }

  constructor() {
    this.updateView(window.innerWidth);
  }

  ngOnInit() {
    this.sortBy = this.type === 'vacancy' || this.type === 'resume' ? 'creationDate' : 'createdAt';
    this.sortByButton('desc');
  }

  sortByButton(sortType: 'desc' | 'asc') {
    this.sortType = sortType;
    this.cards.sort((a, b) => {
      if (sortType === 'desc') {
        return b[this.sortBy] - a[this.sortBy]
      } else {
        return a[this.sortBy] - b[this.sortBy]
      }

    });
  }

  getCardUrl(cardValue: any, type: string, route: string): string {
    localStorage.setItem('routeTypeCard', type);
    return this.router.createUrlTree([route, cardValue]).toString();
  }

  onCardClick(event: MouseEvent, card: any, type: string): void {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    if (type === 'news') {
      void this.router.navigate([`/project`, card.project?.nickname, 'post', card.id]);
    } else {
      void this.router.navigate([type, card.nickname ? card.nickname : card.id]);
    }
  }

  getColumnClass(index: number): string {
    return `column-${(index % 3) + 1}`; // Возвращаем класс для каждого элемента
  }

  getColumns(): any[][] {
    const columns: any[][] = [[], [], []];
    this.cards.forEach((card, index) => {
      let columnIndex = this.isMobile ? 0 : index % 3;
      columns[columnIndex].push(card);
    })

    return columns;
  }

  updateView(width: number): void {
    if (width >= 1024) {
      this.isMobile = false;
    } else if (width >= 768 && width < 1024) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }
}
