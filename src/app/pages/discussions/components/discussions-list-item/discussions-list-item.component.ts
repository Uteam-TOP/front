import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core';
import {IDiscussionPostDto} from "../../../../core/models/discussionDto";
import {AvatarPipe} from "../../../../shared/pipes/avatar.pipe";
import {DatePipe} from "@angular/common";
import {DiscussionsService} from "../../../../core/services/discussions.service";
import {RouterLink} from "@angular/router";
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'app-discussions-list-item',
  standalone: true,
  imports: [
    AvatarPipe,
    DatePipe,
    RouterLink,
    MarkdownComponent
  ],
  templateUrl: './discussions-list-item.component.html',
  styleUrl: './discussions-list-item.component.scss'
})
export class DiscussionsListItemComponent implements OnInit {
  private discussionsService = inject(DiscussionsService);
  post = input<IDiscussionPostDto>({} as IDiscussionPostDto);

  likes = signal<number>(this.post().likesCount);
  dislikes = signal<number>(this.post()?.dislikesCount ?? 0);

  displayPost = signal<IDiscussionPostDto>({} as IDiscussionPostDto);

  ngOnInit() {
    this.displayPost.set(this.post());
  }

  onLike(postId: number) {
    this.discussionsService.likePost(postId).subscribe(result => {
      this.likes.set(result);
      this.displayPost.update(post => ({
        ...post,
        likesCount: result
      }))
    })
  }

  onDislike(postId: number) {
    this.discussionsService.dislikePost(postId).subscribe(result => {
      this.dislikes.set(result);
    })
  }
}
