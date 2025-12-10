import { Component } from '@angular/core';
import {UiButtonComponent} from "../../ui-button/ui-button.component";

@Component({
  selector: 'app-skeleton-sort',
  standalone: true,
    imports: [
        UiButtonComponent
    ],
  templateUrl: './skeleton-sort.component.html',
  styleUrl: './skeleton-sort.component.scss'
})
export class SkeletonSortComponent {

}
