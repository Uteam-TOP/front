import {UserDto} from "./userDto";

export interface IDiscussionPostDto {
  id: number;
  title: string;
  text: string;
  createdAt: string;
  author: UserDto;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  hackathonId?: number;
  projectId?: number;
}

export interface IDiscussionComment {
  id: number;
  text: string;
  postId: number;
  parentCommentId: number;
  level: number;
  author: UserDto;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
}
