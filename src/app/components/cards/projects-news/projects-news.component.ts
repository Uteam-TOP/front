import {Component, inject, Input, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage, NgStyle} from "@angular/common";
import {ProjectService} from "../../projects/project/project.service";
import {AvatarPipe} from "../../../pipes/avatar.pipe";

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

  @Input() newsItem: any;

  likeButton(id: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.projectService.likePost(id).subscribe((res) => {
      if (res) {
        this.newsItem.likesCount = res;
      }
    })
  }
}
