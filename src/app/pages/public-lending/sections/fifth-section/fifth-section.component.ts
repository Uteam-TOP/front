import { Component } from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import {BaseSectionComponent} from "../base-section/base-section.component";

@Component({
  selector: 'app-fifth-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './fifth-section.component.html',
  styleUrl: './fifth-section.component.css'
})
export class FifthSectionComponent extends BaseSectionComponent{

}
