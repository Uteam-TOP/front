import {ChangeDetectionStrategy, Component} from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import { BaseSectionComponent } from "../base-section/base-section.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-third-section',
  standalone: true,
  imports: [LendingFooterButtonComponent, NgOptimizedImage],
  templateUrl: './third-section.component.html',
  styleUrl: './third-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThirdSectionComponent extends BaseSectionComponent {

}
