import {Component, inject, OnInit} from '@angular/core';
import {ListLayerComponent} from "../../../layers/list-layer/list-layer.component";
import {HomeService} from "../../../components/home/home.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable} from "rxjs";

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [
    ListLayerComponent,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.css'
})
export class ResumeListComponent {
  homeService = inject(HomeService);
  resumeList$: Observable<any[]>;

  constructor() {
    this.resumeList$ = this.homeService.getCardData('resume', 0);
  }

}
