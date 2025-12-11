import {Component, inject} from '@angular/core';
import {HomeService} from "../../../components/home/home.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {SkeletonBlockComponent} from "../../../shared/ui-components/skeleton-block/skeleton-block.component";
import {SkeletonSortComponent} from "../../../shared/ui-components/skeleton-ui/skeleton-sort/skeleton-sort.component";

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ListLayerComponent,
    SkeletonBlockComponent,
    SkeletonSortComponent,
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {
  homeService = inject(HomeService);
  projectsList$: Observable<any[]>;

  constructor() {
    this.projectsList$ = this.homeService.getCardProjects(0);
  }
}
