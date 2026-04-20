import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {IHackathonDto} from "../../../core/models/hackathonDto";

@Component({
  selector: 'app-hackathon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hackathon-cad.component.html',
  styleUrl: './hackathon-cad.component.css'
})
export class HackathonCadComponent {

  @Input() cardItem: IHackathonDto = {} as IHackathonDto;

  constructor() { }

  type: any[] = [
    { name: 'Стартап', type: 'STARTUP' },
    { name: 'Компания', type: 'COMPANY' },
    { name: 'Разовый проект', type: 'ONE_TIME_PROJECT' },
  ];

  getFormatText(format: string): string {
    switch(format) {
      case 'ONLINE': return 'онлайн';
      case 'OFFLINE': return 'оффлайн';
      case 'HYBRID': return 'онлайн + оффлайн';
      default: return 'Неизвестный формат';
    }
  }

}
