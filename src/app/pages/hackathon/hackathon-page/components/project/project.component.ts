import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import {NgClass} from "@angular/common";
import {IProjectDto} from "../../../../../core/models/projectDto";
import {AvatarPipe} from "../../../../../shared/pipes/avatar.pipe";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    NgClass,
    AvatarPipe
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  @Input() item?: IProjectDto;
  @Input() isSelected: boolean = false;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    console.log(this.item);
  }

  onAvatarClick(event: Event, project: number): void {
    this.projectService.selectProject(project);
    event.stopPropagation();
  }
}
