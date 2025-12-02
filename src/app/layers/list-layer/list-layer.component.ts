import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {UiButtonComponent} from "../../shared/ui-components/ui-button.component";
import {HackathonCadComponent} from "../../components/home/hackathon-cad/hackathon-cad.component";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ProjectComponent} from "../../components/home/project/project.component";
import { ResumeLibraryComponent, VacancyLibraryComponent } from '../../../common-uteam-library';
import {Router} from "@angular/router";
import {SortByPipe} from "../../pipes/sort-by.pipe";

@Component({
  selector: 'app-list-layer',
  standalone: true,
  imports: [
    UiButtonComponent,
    HackathonCadComponent,
    NgForOf,
    NgIf,
    ProjectComponent,
    ResumeLibraryComponent,
    VacancyLibraryComponent,
    VacancyLibraryComponent,
    ResumeLibraryComponent,
    SortByPipe,
    NgTemplateOutlet,
    NgClass
  ],
  templateUrl: './list-layer.component.html',
  styleUrl: './list-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListLayerComponent implements OnInit {
  @Input() cards: any[] = [];
  @Input() type: 'project' | 'vacancy' | 'resume' | 'hackathon' = 'project';

  private router = inject(Router);

  resumeVisibleSections: string[] = ['profession', 'availability', 'skills', 'motivations', 'profile']

  public sortBy = 'createdAt';
  public sortType: 'desc' | 'asc' = 'desc';

  ngOnInit() {
    console.log('cards', this.cards);
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
      const columnIndex = index % 3;
      columns[columnIndex].push(card);
    })

    return columns;
  }
}
