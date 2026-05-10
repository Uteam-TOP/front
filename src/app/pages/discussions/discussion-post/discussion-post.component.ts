import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {DiscussionsService} from "../../../core/services/discussions.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, take} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AvatarPipe} from "../../../shared/pipes/avatar.pipe";
import {DatePipe} from "@angular/common";
import {IDiscussionComment, IDiscussionPostDto} from "../../../core/models/discussionDto";
import {UserService} from "../../../core/services/user.service";
import {FormsModule} from "@angular/forms";
import {UiButtonComponent} from "../../../shared/ui-components/ui-button/ui-button.component";
import {MarkdownComponent} from "ngx-markdown";
import {DiscussionsCommentComponent} from "../components/discussions-comment/discussions-comment.component";

@Component({
  selector: 'app-discussion-post',
  standalone: true,
  imports: [
    AvatarPipe,
    DatePipe,
    RouterLink,
    FormsModule,
    UiButtonComponent,
    MarkdownComponent,
    DiscussionsCommentComponent
  ],
  templateUrl: './discussion-post.component.html',
  styleUrl: './discussion-post.component.scss'
})
export class DiscussionPostComponent implements OnInit {
  private discussionsService = inject(DiscussionsService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  private id = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    ),
    { initialValue: 0 }
  );

  likes = signal<number>(0);
  dislikes = signal<number>(0);

  serverPost = toSignal<IDiscussionPostDto>(this.discussionsService.getPost(this.id()));
  currentPost = signal<IDiscussionPostDto>({} as IDiscussionPostDto);
  currentUser = toSignal(this.userService.userData$);

  serverComments = toSignal(this.discussionsService.getPostComments(this.id()));
  localComments = signal<IDiscussionComment[]>([]);

  comments = computed<IDiscussionComment[]>(() => {
    const original = this.serverComments();
    const updated = this.localComments();
    let commentsList: IDiscussionComment[] = [];
    commentsList = [...original ?? [], ...updated ?? []];

    commentsList.forEach((item, i) => {
      if (item.parentCommentId) {
        const index = commentsList.findIndex(comment => {
          if (!comment) return null;
          return comment.id === item.parentCommentId
        });
        if (index !== -1) {
          if (!commentsList[index].childrenComments?.length) {
            commentsList[index].childrenComments = [];
          }
          if (!commentsList[index].childrenComments?.find(comment => comment.id === item.id)) {
            commentsList[index].childrenComments?.push(item);
          }

          delete commentsList[i];
        }

      }
    })

    if (!commentsList.length) return [];
    return commentsList;
  })

  displayPost = computed<IDiscussionPostDto>(() => {
    const original = this.serverPost();
    const updated = this.currentPost();

    if (!original) return {} as IDiscussionPostDto;
    return {...original, ...updated};
  })

  commentForm = '';

  commentsCount = signal<{ id: any; count: number; }[]>([])

  constructor() {
    effect(() => {
      let comments = this.comments();
      let commentsCount: { id: any; count: number; }[] = [];
      setTimeout(() => {
        if (comments && comments.length > 0) {
          comments.forEach((comment) => {
            if (comment.childrenComments) {
              commentsCount.push({id: comment.id, count: this.countAllProperties(comment.childrenComments)});
            }
          })
          this.commentsCount.set(commentsCount);
        }
      })
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
  }

  countAllProperties(comments: any[]): number {
    if (!comments || !Array.isArray(comments)) return 0;
    return comments.reduce((acc, comment) => {
      const childrenCount = this.countAllProperties(comment.childrenComments);
      return acc + 1 + childrenCount;
    }, 0);
  }

  onLike(postId: number) {
    this.discussionsService.likePost(postId).subscribe(result => {
      this.likes.set(result);
      this.currentPost.update(post => ({
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

  onSubmit(parentId: number | null = null, level: number = 0, comment: string = this.commentForm) {
    this.commentForm = '';
    const currentUser = this.currentUser();
    if (currentUser) {
      const commentData: IDiscussionComment = {
        text: comment,
        postId: this.id(),
        parentCommentId: parentId,
        level: level,
        author: currentUser,
      }
      this.discussionsService.addComment(commentData).subscribe(result => {
        this.localComments.set([result]);
      })
    }

  }

  increaseCountComments(commentId: number) {
    // const commentIndex = this.commentsCount.findIndex(item => item.id === commentId);
    // console.log(commentIndex);
    // if (commentIndex !== -1) {
    //   this.commentsCount[commentIndex].count++;
    // } else {
    //   this.commentsCount.push({id: commentId, count: 1});
    // }
  }

}
