import {Component, inject} from '@angular/core';
import {HomeService} from "../../../components/home/home.service";
import {Observable} from "rxjs";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {AsyncPipe} from "@angular/common";
import {SkeletonBlockComponent} from "../../../shared/ui-components/skeleton-block/skeleton-block.component";

@Component({
  selector: 'app-hackathons-list',
  standalone: true,
  imports: [
    ListLayerComponent,
    AsyncPipe,
    SkeletonBlockComponent,
  ],
  templateUrl: './hackathons-list.component.html',
  styleUrl: './hackathons-list.component.css'
})
export class HackathonsListComponent {
  homeService = inject(HomeService);
  hackathonsList$: Observable<any[]>;

  constructor() {
    this.hackathonsList$ = this.homeService.getCardHackathons(0);
  }
}
