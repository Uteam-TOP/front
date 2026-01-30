import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project.service';
import { CommonModule } from '@angular/common';
import { SettingHeaderService } from '../../../../setting-header.service';
import {AvatarPipe} from "../../../../../pipes/avatar.pipe";
import {PopUpEntryService} from "../../../../pop-up-entry/pop-up-entry.service";

@Component({
  selector: 'app-screensaver-phone',
  standalone: true,
  imports: [CommonModule, AvatarPipe],
  templateUrl: './screensaver-phone.component.html',
  styleUrl: './screensaver-phone.component.css'
})
export class ScreensaverPhoneComponent implements OnInit {

  @Input() detailsList: any;
  avatarLink: string = ''
  isLiked = false;
  isOwner: boolean = false;
  projectData: any;

  constructor(private router: Router, private projectService: ProjectService,
    private cdr: ChangeDetectorRef, public settingHeaderService:SettingHeaderService,
              private popUpEntryService: PopUpEntryService) { }

  ngOnInit(): void {
    this.projectService.currentProjectData$.subscribe((value: any) => {
      this.projectData = value;
      if (value && value.headerLink) { // Проверяем, что value не null/undefined
        this.setTargetAvata(value.headerLink, 'overlay');
      }
      if (value && value.avatarLink) { // Проверяем, что value не null/undefined
        this.avatarLink = value.avatarLink || ''; // Защита от undefined
      }
    });
    this.projectService.currentProjectIsOwner$.subscribe((value: boolean)=>{
      this.isOwner = value;
    })
  }

  tags = [{ name: 'Стартап', type: 'STARTUP' }, { name: 'Компания', type: 'COMPANY' }, { name: 'Разовый проект', type: 'ONE_TIME_PROJECT' }]

  getTagName(type: string): string {
    const tag = this.tags.find(tag => tag.type === type);
    return tag ? tag.name : '';
  }

  getEditProject() {
    this.router.navigate(['editProject', this.projectData.nickname]);
    this.projectService.isEditProject = true;
  }

  setTargetAvata(objectUrl: string, block: string) {
    const backgroundContainer = document.querySelector(`.${block}`) as HTMLElement;
    if (backgroundContainer) {
      backgroundContainer.style.backgroundImage = `url(${objectUrl})`;
      backgroundContainer.style.backgroundSize = 'cover';
      backgroundContainer.style.backgroundPosition = 'center';
    }
  }

  toggleLike(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    let userData = localStorage.getItem('authToken');
    let userNickname = localStorage.getItem('autuserNicknamehToken');
    if (!userData && !userNickname) {
      this.popUpEntryService.showDialog();
      return;
    }

    this.projectService.likeProject(this.detailsList.id).subscribe((result) => {
      this.detailsList.userLike = !this.detailsList.userLike;
      this.detailsList.likesCount = result;
      this.cdr.detectChanges();
    }, error => {
      console.error('Ошибка при отправке лайка:', error);
    });
  }

}
