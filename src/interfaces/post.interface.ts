export interface ActionInfo {
  ownerName: string;
  ownerEmail: string;
}

export interface Reply {
  _id: string;
  postId: string;
  commentId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerEmail: string;
  content: object;
  numberOfLikes: number;
  likes: ActionInfo[];
  numberOfDislikes: number;
  dislikes: ActionInfo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  postId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerEmail: string;
  content: object;
  numberOfLikes: number;
  likes: ActionInfo[];
  numberOfDislikes: number;
  dislikes: ActionInfo[];
  numberOfRyplies: number;
  replies: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  label: string;
  value: string;
}

export interface Post {
  _id: string;
  title: string;
  tags: Tag[];
  ownerName: string;
  ownerAvatar: string;
  ownerEmail: string;
  groupId: string;
  groupName: string;
  content: object;
  numberOfLikes: number;
  likes: ActionInfo[];
  numberOfDislikes: number;
  dislikes: ActionInfo[];
  numberOfComments: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostQuery {
  page: number;
  limit: number;
  ownerEmail: string;
}
