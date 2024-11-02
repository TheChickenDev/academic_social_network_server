export interface Reply {
  _id: string;
  postId: string;
  commentId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerEmail: string;
  content: object;
  numberOfLikes: number;
  numberOfDislikes: number;
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
  numberOfDislikes: number;
  numberOfRyplies: number;
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
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
  numberOfDislikes: number;
  numberOfComments: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostQuery {
  _id: string;
  page: number;
  limit: number;
  ownerEmail: string;
}
