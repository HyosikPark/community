export interface Comment {
  _id: string;
  nickname: string;
  password: string;
  content: string;
  createdAt: string;
  ip: string;
}

export interface PostSchema {
  _id: string;
  number: number;
  category: string;
  nickname: string;
  password: string;
  title: string;
  content: string;
  createdAt: string;
  comments: [Comment];
  commentCount: number;
  likeCount: number;
  views: number;
  likeUser: [string];
  ip: string;
}

export type ExHotPost = 'password' | 'comments' | 'ip';
export type ExPost = '_id' | 'ip';
export type ExBoardPost =
  | 'password'
  | 'comments'
  | 'ip'
  | 'category'
  | 'likeUser';
