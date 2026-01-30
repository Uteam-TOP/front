import {Component, Input} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  @Input() tag: any;

  getTagText(item: number): string {
    switch (item) {
      case 1:
        return 'Jun';
      case 2:
        return 'Mdl';
      case 3:
        return 'Snr';
      default:
        return '';
    }
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

  getTagColor(item: number): string {
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

}
