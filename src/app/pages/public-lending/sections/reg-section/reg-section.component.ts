import {ChangeDetectionStrategy, Component} from '@angular/core';
import { BaseSectionComponent } from "../base-section/base-section.component";

@Component({
  selector: 'app-reg-section',
  standalone: true,
  imports: [],
  templateUrl: './reg-section.component.html',
  styleUrl: './reg-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegSectionComponent extends BaseSectionComponent{

}
