
import {Component, effect, inject, input, Input, InputSignal, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HackathonService } from '../../../../../components/hackathon/page/hackathon.service';
import {IHackathonDto} from "../../../../../core/models/hackathonDto";

@Component({
  selector: 'app-hackathon-screensaver',
  standalone: true,
  imports: [],
  templateUrl: './screensaver.component.html',
  styleUrl: './screensaver.component.css'
})
export class ScreensaverHackComponent {
  private router = inject(Router)
  private hackathonService = inject(HackathonService);

  detailsList: InputSignal<IHackathonDto> = input.required<IHackathonDto>();

  avatarLink: string = ''
  isOwner: boolean = false;

  constructor() {
    effect(() => {
      this.setTargetAvatar(this.detailsList().imageLink, 'overlay');
      this.avatarLink = this.detailsList().avatarLink || '';
      this.hackathonService.currentProjectIsOwner$.subscribe((value: boolean) => {
        this.isOwner = value;
      })
    });
  }

  tags = [{ name: 'Стартап', type: 'STARTUP' }, { name: 'Компания', type: 'COMPANY' }, { name: 'Разовый проект', type: 'ONE_TIME_PROJECT' }]

  getTagName(type: string): string {
    const tag = this.tags.find(tag => tag.type === type);
    return tag ? tag.name : '';
  }

  getEditProject() {
    this.hackathonService.currentProjectData$.subscribe((value: any) => {
      this.router.navigate(['editProject', value.nickname]);
      this.hackathonService.isEditProject = true;
    })
  }

  setTargetAvatar(objectUrl: string = '', block?: string) {
    const backgroundContainer = document.querySelector(`.${block}`) as HTMLElement;
    if (backgroundContainer) {
      console.log('backgroundContainer', backgroundContainer);
      backgroundContainer.style.backgroundImage = `url(${objectUrl})`;
      backgroundContainer.style.backgroundSize = 'cover';
      backgroundContainer.style.backgroundPosition = 'center';
    }
  }

  formatRussianDate(date: Date | string): string {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month}`;
  }

  getRegistrationStatusText(status: string): string {
    const now = new Date();
    const nowSeconds = Math.floor(now.getTime() / 1000);
    if (nowSeconds > this.detailsList().endDate) {
      return 'Событие завершено'
    }
    if (nowSeconds > this.detailsList().registrationDeadline) {
      return 'Регистрация закончена'
    }
    if (this.detailsList().endDate) {
      switch (status) {
        case 'OPEN': return 'Регистрация открыта';
        case 'CLOSED': return 'Регистрация закончена';
        case 'PENDING': return `Регистрация с ${this.formatRussianDate(this.detailsList().endDate)}`;
        default: return '';
      }
    } else {
      return '';
    }

  }

}
