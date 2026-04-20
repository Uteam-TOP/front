import {Component, inject, OnInit, signal} from '@angular/core';
import {HomeService} from "../../../components/home/home.service";
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {AsyncPipe} from "@angular/common";
import {SkeletonBlockComponent} from "../../../shared/ui-components/skeleton-block/skeleton-block.component";
import {HackathonDto, IHackathonDto} from "../../../core/models/hackathonDto";
import {UserService} from "../../../core/services/user.service";
import {forkJoin, mergeMap, of, take} from "rxjs";

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
export class HackathonsListComponent implements OnInit {
  homeService = inject(HomeService);
  userService = inject(UserService);
  hackathonsList = signal<IHackathonDto[]>([]);

  constructor() {}

  ngOnInit() {
    forkJoin([this.homeService.getCardHackathons(0).pipe(take(1)), this.userService.isAdmin().pipe(take(1))]).subscribe(data => {
      let filteredData = [];
      const cards = data[0];
      const isAdmin = data[1];
      console.log(isAdmin);
      if (isAdmin) {
        filteredData = cards;
      } else {
        filteredData = cards.filter((hackathon: IHackathonDto) =>
          hackathon.registrationStatus !== HackathonDto.RegistrationStatusEnum.Pending)
      }

      this.hackathonsList.set(filteredData);
    });
  }
}
