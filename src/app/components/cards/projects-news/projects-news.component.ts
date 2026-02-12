import {Component, inject, Input, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage, NgStyle} from "@angular/common";
import {ProjectService} from "../../projects/project/project.service";
import {AvatarPipe} from "../../../shared/pipes/avatar.pipe";
import {PopUpEntryService} from "../../pop-up-entry/pop-up-entry.service";

@Component({
  selector: 'app-projects-news',
  standalone: true,
  imports: [
    NgStyle,
    NgOptimizedImage,
    DatePipe,
    AvatarPipe
  ],
  templateUrl: './projects-news.component.html',
  styleUrl: './projects-news.component.scss'
})
export class ProjectsNewsComponent {
  private projectService = inject(ProjectService);
  private popUpEntryService = inject(PopUpEntryService);
  @Input() newsItem: any;

  likeButton(id: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    let userData = localStorage.getItem('authToken');
    let userNickname = localStorage.getItem('userNickname');
    if (!userData && !userNickname) {
      this.popUpEntryService.showDialog();
      return;
    }

    this.projectService.likePost(id).subscribe((res) => {
      if (res) {
        this.newsItem.likesCount = res;
      } else {
        this.newsItem.likesCount = this.newsItem.likesCount - 1;
      }
    })
  }
}
