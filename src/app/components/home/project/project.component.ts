import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environment';
import { PopUpEntryService } from '../../pop-up-entry/pop-up-entry.service';
import {AvatarPipe} from "../../../shared/pipes/avatar.pipe";
import {ProjectService} from "../../projects/project/project.service";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, AvatarPipe],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  @Input() cardItem: any;
  isLiked = false;

  constructor(private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private projectService: ProjectService,
    private popUpEntryService: PopUpEntryService) { }

  type: any[] = [
    { name: 'Стартап', type: 'STARTUP' },
    { name: 'Компания', type: 'COMPANY' },
    { name: 'Разовый проект', type: 'ONE_TIME_PROJECT' },
  ];

  getTypeName(type: string): string {
    const found = this.type.find(item => item.type === type);
    return found ? found.name : 'Неизвестный тип';
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

  getSkills(item: number): string {
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


  toggleLike(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    let userData = localStorage.getItem('authToken');
    let userNickname = localStorage.getItem('autuserNicknamehToken');
    if (!userData && !userNickname) {
      this.popUpEntryService.showDialog(true, 'Войдите, чтобы иметь возможность оценивать посты');
      return;
    }

    this.projectService.likeProject(this.cardItem.id).subscribe((result) => {
      this.cardItem.userLike = !this.cardItem.userLike;
      this.cardItem.likesCount = result;
      this.cdr.detectChanges();
    }, error => {
      console.error('Ошибка при отправке лайка:', error);
    });
  }

  viewUser(event: Event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate([``, id]);
  }

  viewJob(event: Event, id: string) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate([`/vacancy/`, id]);
  }
}
