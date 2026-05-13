import {Component, inject, OnInit, signal} from '@angular/core';
import {DiscussionsService} from "../../../core/services/discussions.service";
import {IDiscussionPostDto} from "../../../core/models/discussionDto";
import {DiscussionPostComponent} from "../discussion-post/discussion-post.component";
import {DiscussionsListItemComponent} from "../components/discussions-list-item/discussions-list-item.component";
import {SortByPipe} from "../../../shared/pipes/sort-by.pipe";
import {NgClass} from "@angular/common";
import {UiButtonComponent} from "../../../shared/ui-components/ui-button/ui-button.component";
import {RouterLink} from "@angular/router";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-discussions-list',
  standalone: true,
  imports: [
    DiscussionPostComponent,
    DiscussionsListItemComponent,
    SortByPipe,
    NgClass,
    UiButtonComponent,
    RouterLink
  ],
  templateUrl: './discussions-list.component.html',
  styleUrl: './discussions-list.component.scss'
})
export class DiscussionsListComponent implements OnInit {
  private discussionsService = inject(DiscussionsService);
  userService = inject(UserService);

  allPosts = signal<IDiscussionPostDto[]>([]);

  sortByField: 'createdAt' | 'commentsCount' = 'createdAt';

  sortButtons: { field: 'createdAt' | 'commentsCount', title: string }[] = [
    {field: 'createdAt', title: 'Новое'},
    {field: 'commentsCount', title: 'Популярное'},
  ]

  ngOnInit(): void {
    this.discussionsService.getAllPosts(0, 10).subscribe(result => {
      this.allPosts.set(result);
    })
  }

  onSort(field: 'createdAt' | 'commentsCount'): void {
    this.sortByField = field;
  }
}
