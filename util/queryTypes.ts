export interface Comment {
  _id: string;
  nickname: string;
  password: string;
  content: string;
  createdAt: string;
  ip: string;
}

export interface PostQuery {
  number: number;
  category: string;
  nickname: string;
  password: string;
  title: string;
  content: string;
  createdAt: string;
  comments: Comment[];
  commentCount: number;
  likeCount: number;
  views: number;
}

export interface BoardPost {
  _id: string;
  number: number;
  nickname: string;
  title: string;
  content: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  views: number;
  ip: string;
}

export interface HomePost extends BoardPost {
  category: string;
}
