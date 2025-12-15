import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project.service';
import { CommonModule } from '@angular/common';
import { SettingHeaderService } from '../../../../setting-header.service';

@Component({
  selector: 'app-screensaver-phone',
  standalone: true,
  imports: [CommonModule],
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
    private cdr: ChangeDetectorRef, public settingHeaderService:SettingHeaderService) { }

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
    this.isLiked = !this.isLiked;
    this.cdr.detectChanges();
  }

}
