import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import { BaseSectionComponent } from "../base-section/base-section.component";

@Component({
  selector: 'app-fourth-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './fourth-section.component.html',
  styleUrl: './fourth-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FourthSectionComponent extends BaseSectionComponent{
  @Output() pageLink = new EventEmitter();

  goToPage(url: string[], type?: string):void {
    this.pageLink.emit({url, type});
  }
}
