import {Component, Inject, input, Input, InputSignal, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from "@angular/router";
import {resumeVacancyDto} from "../../../core/models/resumeVacancyDto";
import {SkillsPipe} from "../../../shared/pipes/skills.pipe";

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, SkillsPipe],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent  implements OnChanges {

  public data = input.required<resumeVacancyDto>();

  private router = Inject(Router);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
    }
  }

  getSpecialization(): string {
    return this.data().profession && this.data().profession.name
      ? this.data().profession.name?.toUpperCase()
      : 'Не указана';
  }

  getMotivationColor(motivation: string): string {
    switch (motivation) {
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

  viewUser() {
    const userId = localStorage.getItem('userNickname')
    this.router.navigate([`/${userId}`]);
  }
}
