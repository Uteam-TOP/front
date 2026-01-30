import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { LendingFooterButtonComponent } from "../lending-footer-button/lending-footer-button.component";
import {BaseSectionComponent} from "../base-section/base-section.component";
import {PopUpEntryService} from "../../../../components/pop-up-entry/pop-up-entry.service";

@Component({
  selector: 'app-two-section',
  standalone: true,
  imports: [LendingFooterButtonComponent],
  templateUrl: './two-section.component.html',
  styleUrl: './two-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoSectionComponent extends BaseSectionComponent {
  private popUpEntryService = inject(PopUpEntryService)

  handleRegistration(): void {
    this.popUpEntryService.isAuth = true;
    this.popUpEntryService.accessVerification = false;
    this.popUpEntryService.confirmAuth = false;
    localStorage.removeItem('confirmAuth');
    localStorage.removeItem('authEmail');
    this.popUpEntryService.showDialog();
  }
}
