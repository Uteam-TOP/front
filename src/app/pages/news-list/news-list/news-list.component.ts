import {Component, inject} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {SkeletonBlockComponent} from "../../../shared/ui-components/skeleton-block/skeleton-block.component";
import {HomeService} from "../../../components/home/home.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ListLayerComponent,
    SkeletonBlockComponent
  ],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss'
})
export class NewsListComponent {
  homeService = inject(HomeService);
  newsList$: Observable<any[]>;

  constructor() {
    this.newsList$ = this.homeService.getNewsData(0, 100);
  }
}
