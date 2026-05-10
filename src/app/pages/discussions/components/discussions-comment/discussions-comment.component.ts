import {Component, computed, effect, inject, input, model, output} from '@angular/core';
import {AvatarPipe} from "../../../../shared/pipes/avatar.pipe";
import {DatePipe, I18nPluralPipe, NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MarkdownComponent} from "ngx-markdown";
import {UiButtonComponent} from "../../../../shared/ui-components/ui-button/ui-button.component";
import {RouterLink} from "@angular/router";
import {IDiscussionComment, IDiscussionPostDto} from "../../../../core/models/discussionDto";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {UserService} from "../../../../core/services/user.service";
import {debounceTime, map} from "rxjs";
import {DiscussionsService} from "../../../../core/services/discussions.service";

@Component({
  selector: 'app-discussions-comment',
  standalone: true,
  imports: [
    AvatarPipe,
    DatePipe,
    FormsModule,
    MarkdownComponent,
    UiButtonComponent,
    RouterLink,
    NgClass,
    I18nPluralPipe
  ],
  templateUrl: './discussions-comment.component.html',
  styleUrl: './discussions-comment.component.scss'
})
export class DiscussionsCommentComponent {
  private discussionsService = inject(DiscussionsService);

  comment = model<IDiscussionComment>({} as IDiscussionComment);
  inputComments = input<IDiscussionComment[]>();
  commentsCount = input<any>()

  private userService = inject(UserService);

  currentUser = toSignal(this.userService.userData$);

  onCommentReply = output<{parentId: number, level: number, comment: string}>();

  commentForm = '';
  showResponseFormId? = 0;
  countComments = 0;

  increaseCount = output<number>();
  hideChildren = false;

  childrenComments = computed<IDiscussionComment[]>(() => {
    const childrenComments = this.comment()?.childrenComments;
    let inputComments: IDiscussionComment[] | undefined = [];
    if (this.inputComments()) {
      inputComments = this.inputComments()?.filter(comment => {
        if (!comment) return null;
        return comment.level > 0;
      });
    }
    // const inputComments = this.inputComments()
    let commentsList: IDiscussionComment[] = [];
    commentsList = [...inputComments ?? [], ...childrenComments ?? []];

    commentsList.forEach((item, i) => {
      if (item) {
        if (item.parentCommentId) {
          this.increaseCount.emit(item.parentCommentId);
          const index = commentsList.findIndex(comment => {
            if (!comment) return null;
            return comment.id === item.parentCommentId
          });
          if (index !== -1) {
            if (!commentsList[index].childrenComments && !commentsList[index].childrenComments?.length) {
              commentsList[index].childrenComments = [];
            }
            if (!commentsList[index].childrenComments?.find(comment => comment.id === item.id)) {
              commentsList[index].childrenComments?.push(item);
            }
          }
          delete commentsList[i];
        }

        if (inputComments) {

          const inputComment = inputComments.find(comment => comment.parentCommentId === item.id);
          if (!inputComment) {
            delete commentsList[i];
          }
        }
      }
    })

    commentsList = [...childrenComments ?? [], ...commentsList];

    if (!commentsList.length) return [];
    return commentsList;
  });

  commentsChildrenCount = toSignal(
    toObservable<IDiscussionComment[]>(this.childrenComments).pipe(
      debounceTime(300),
      map(data => {
        if (!data) return [];
        return data.map(c => {
          if (c && c.id) {
            return {
              id: c.id,
              count: this.countAllProperties(c.childrenComments || [])
            }
          } else {
            return null;
          }
        });
      })
    ),
    { initialValue: [] }
  );

  branchOpener: { [k: string]: string } = {
    '=1': 'ответ',
    '=2': '# ответа',
    '=3': '# ответа',
    '=4': '# ответа',
    'other': '# ответов'
  };

  constructor() {
    effect(() => {
      const commentsCount = this.commentsCount();
      const comment = this.comment();
      if (commentsCount.length && comment) {
        const countItem = commentsCount.find((item: any) => {
          if (!item && !item.count && !comment) return null;
          return comment.id === item.id
        });
        if (countItem.count) this.countComments = countItem.count;
        if (this.countComments > 3) this.hideChildren = true;
      }
    });
  }

  countAllProperties(comments: any[]): number {
    if (!comments || !Array.isArray(comments)) return 0;
    return comments.reduce((acc, comment) => {
      const childrenCount = this.countAllProperties(comment.childrenComments);
      return acc + 1 + childrenCount;
    }, 0);
  }

  onCommentLike(commentId: number = 0) {
    this.discussionsService.likeComment(commentId).subscribe(result => {
      this.comment.update(comment => ({
        ...comment,
        likesCount: result
      }))
    })
  }

  onCommentDislike(commentId: number = 0) {
    this.discussionsService.dislikeComment(commentId).subscribe(result => {
      this.comment.update(comment => ({
        ...comment,
        dislikesCount: result
      }))
    })
  }

  clickSubmit(parentId?: number, level: number = 0, comment: string = this.commentForm) {
    this.showResponseFormId = 0;
    if (parentId) {
      this.onCommentReply.emit({parentId, level, comment: comment})
      this.commentForm = '';
    }
  }
}
