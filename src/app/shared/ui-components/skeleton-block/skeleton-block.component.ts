import {AfterViewInit, Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {SkeletonProjectComponent} from "./blocks/skeleton-project/skeleton-project.component";
import {SkeletonHackathonComponent} from "./blocks/skeleton-hackathon/skeleton-hackathon.component";
import {SkeletonSortComponent} from "../skeleton-ui/skeleton-sort/skeleton-sort.component";

@Component({
  selector: 'skeleton-block',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    UpperCasePipe,
    SkeletonProjectComponent,
    SkeletonHackathonComponent,
    NgClass,
    SkeletonSortComponent
  ],
  templateUrl: './skeleton-block.component.html',
  styleUrl: './skeleton-block.component.scss'
})
export class SkeletonBlockComponent implements AfterViewInit {
  @Input() type: 'project' | 'hackathon' | 'vacancy' | 'resume' = 'project';
  @Input() amount: number = 1;
  @Input() wrap: 'wrap' | 'nowrap' = 'nowrap';

  blocks: number[] = [];

  constructor() {}

  ngAfterViewInit() {
    for (let i = 0; i < this.amount; i++) {
      this.blocks.push(i);
    }
  }
}
