import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-projects-news',
  standalone: true,
  imports: [],
  templateUrl: './projects-news.component.html',
  styleUrl: './projects-news.component.scss'
})
export class ProjectsNewsComponent {

  @Input() newsItem: any;

}
