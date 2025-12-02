import {Component, inject} from '@angular/core';
import {HomeService} from "../../../components/home/home.service";
import {Observable} from "rxjs";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-hackathons-list',
  standalone: true,
  imports: [
    ListLayerComponent,
    AsyncPipe
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
