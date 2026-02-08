import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {resumeVacancyDto} from "../../../core/models/resumeVacancyDto";
import {SkillsPipe} from "../../../shared/pipes/skills.pipe";

@Component({
  selector: 'app-vacancy',
  standalone: true,
  imports: [CommonModule, SkillsPipe],
  templateUrl: './vacancy.component.html',
  styleUrl: './vacancy.component.css'
})
export class VacancyComponent {

  public data = input.required<resumeVacancyDto>();

  getMotivationColor(item: string): string {
    switch (item) {
      case 'Без оплаты':
        return '#ffab00';
      case 'Нужна практика':
        return '#cf87f1';
      case 'За долю':
        return '#298cf4';
      case 'За оплату':
        return '#23b9b0';
      default:
        return '';
    }
  }

  hasPaymentMotivation(): boolean {
    return this.data().motivations?.some((motivation: any) => motivation.name === 'За оплату') && this.data().minPayment > 0
  }

}
