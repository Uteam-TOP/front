import {ChangeDetectionStrategy, Component, HostListener, inject, Input, OnInit} from '@angular/core';
import {UiButtonComponent} from "../../shared/ui-components/ui-button/ui-button.component";
import {ProjectComponent} from "../../components/home/project/project.component";
import { ResumeLibraryComponent, } from '../../../common-uteam-library';
import {Router} from "@angular/router";
import {VacancyComponent} from "../../components/cards/vacancy/vacancy.component";
import {NotFoundComponent} from "../not-found/not-found.component";

@Component({
  selector: 'app-list-layer',
  standalone: true,
  imports: [
    UiButtonComponent,
    ProjectComponent,
    ResumeLibraryComponent,
    ResumeLibraryComponent,
    VacancyComponent,
    NotFoundComponent
],
  templateUrl: './list-layer.component.html',
  styleUrl: './list-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLayerComponent implements OnInit {
  @Input() cards: any[] = [];
  @Input() type: 'project' | 'vacancy' | 'resume' | 'hackathon' = 'project';

  private router = inject(Router);

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

  onCardClick(event: MouseEvent, cardId: any, type: string): void {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    event.preventDefault();
    this.router.navigate([`/${type}`, cardId]);
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
