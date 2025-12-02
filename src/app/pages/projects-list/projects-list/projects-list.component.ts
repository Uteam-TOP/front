import {Component, inject} from '@angular/core';
import {HomeService} from "../../../components/home/home.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ListLayerComponent
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
