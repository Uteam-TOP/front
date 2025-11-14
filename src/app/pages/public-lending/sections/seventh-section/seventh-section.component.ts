import { Component } from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import {BaseSectionComponent} from "../base-section/base-section.component";

@Component({
  selector: 'app-seventh-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './seventh-section.component.html',
  styleUrl: './seventh-section.component.css'
})
export class SeventhSectionComponent extends BaseSectionComponent{

}
