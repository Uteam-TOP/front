import { Component } from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import { BaseSectionComponent } from "../base-section/base-section.component";

@Component({
  selector: 'app-third-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './third-section.component.html',
  styleUrl: './third-section.component.css'
})
export class ThirdSectionComponent extends BaseSectionComponent {

}
