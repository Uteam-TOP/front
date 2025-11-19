import { Component } from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import { BaseSectionComponent } from "../base-section/base-section.component";

@Component({
  selector: 'app-fourth-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './fourth-section.component.html',
  styleUrl: './fourth-section.component.css'
})
export class FourthSectionComponent extends BaseSectionComponent{

}
