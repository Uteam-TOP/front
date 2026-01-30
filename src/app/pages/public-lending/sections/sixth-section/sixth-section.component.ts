import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { BaseSectionComponent } from "../base-section/base-section.component";
import {PopUpEntryService} from "../../../../components/pop-up-entry/pop-up-entry.service";

@Component({
  selector: 'app-sixth-section',
  standalone: true,
  imports: [],
  templateUrl: './sixth-section.component.html',
  styleUrl: './sixth-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SixthSectionComponent extends BaseSectionComponent {
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
