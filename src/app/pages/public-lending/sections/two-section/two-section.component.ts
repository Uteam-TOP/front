import { Component } from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import {BaseSectionComponent} from "../base-section/base-section.component";

@Component({
  selector: 'app-two-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './two-section.component.html',
  styleUrl: './two-section.component.css'
})
export class TwoSectionComponent extends BaseSectionComponent {

}
