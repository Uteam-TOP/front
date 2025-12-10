import {Component, inject} from '@angular/core';
import {HomeService} from "../../../components/home/home.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {SkeletonBlockComponent} from "../../../shared/ui-components/skeleton-block/skeleton-block.component";

@Component({
  selector: 'app-vacancies-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ListLayerComponent,
    SkeletonBlockComponent
  ],
  templateUrl: './vacancies-list.component.html',
  styleUrl: './vacancies-list.component.css'
})
export class VacanciesListComponent {
  homeService = inject(HomeService);
  vacanciesList$: Observable<any[]>;

  constructor() {
    this.vacanciesList$ = this.homeService.getCardData('vacancy', 0);
  }

}
