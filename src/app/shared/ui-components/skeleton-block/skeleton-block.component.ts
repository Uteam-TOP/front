import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {SkeletonProjectComponent} from "./blocks/skeleton-project/skeleton-project.component";
import {SkeletonHackathonComponent} from "./blocks/skeleton-hackathon/skeleton-hackathon.component";
import {SkeletonSortComponent} from "../skeleton-ui/skeleton-sort/skeleton-sort.component";
import {SkeletonVacancyComponent} from "./blocks/skeleton-vacancy/skeleton-vacancy.component";
import {SkeletonResumeComponent} from "./blocks/skeleton-resume/skeleton-resume.component";

@Component({
  selector: 'skeleton-block',
  standalone: true,
  imports: [
    SkeletonProjectComponent,
    SkeletonHackathonComponent,
    NgClass,
    SkeletonSortComponent,
    SkeletonVacancyComponent,
    SkeletonResumeComponent
  ],
  templateUrl: './skeleton-block.component.html',
  styleUrl: './skeleton-block.component.scss'
})
export class SkeletonBlockComponent implements OnInit {
  @Input() type: 'project' | 'hackathon' | 'vacancy' | 'resume' | 'news' = 'project';
  @Input() amount: number = 1;
  @Input() wrap: 'wrap' | 'nowrap' = 'nowrap';

  blocks: number[] = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.amount; i++) {
      this.blocks.push(i);
    }
  }
}
