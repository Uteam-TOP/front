import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, inject, input, Input, Output} from '@angular/core';
import {ResumePersonService} from "./resume-person.service";
import {resumeVacancyDto} from "../../../../../core/models/resumeVacancyDto";

@Component({
  selector: 'app-resume-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-person.component.html',
  styleUrl: './resume-person.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumePersonComponent {

  private resumePersonService = inject(ResumePersonService);

  item = input.required<resumeVacancyDto>();
  isSelected = input<boolean>(false)
  @Output() itemSelected = new EventEmitter<any>();

  onAvatarClick(event: Event, resume: resumeVacancyDto): void {
    this.resumePersonService.selectResume(resume);
    this.itemSelected.emit(resume);
    event.stopPropagation();
  }

  getSkillsColor(item: number): string {
    switch (item) {
      case 1:
        return '#50B229';
      case 2:
        return '#FAD305';
      case 3:
        return '#EE5354';
      default:
        return '';
    }
  }

  getSkills(item: any): string {
    switch (item) {
      case 1:
        return 'Junior';
      case 2:
        return 'Middle';
      case 3:
        return 'Senior';
      default:
        return '';
    }
  }
}
