
import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-about-project',
  standalone: true,
  imports: [],
  templateUrl: './about-project.component.html',
  styleUrl: './about-project.component.css'
})
export class AboutProjectComponent {

  @Input() detailsList: any;
  
  constructor(public projectService: ProjectService) {

  }

}
