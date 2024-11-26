import { Document } from 'mongoose';

export interface Comment extends Document {
  _id: string;
  postId: string;
  parentId: string;
  ownerId: string;
  content: object;
  numberOfLikes: number;
  likedBy: String[];
  numberOfDislikes: number;
  dislikedBy: String[];
  numberOfRyplies: number;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post extends Document {
  _id: string;
  title: string;
  tags: string[];
  ownerId: string;
  groupId: string;
  content: object;
  numberOfLikes: number;
  likedBy: String[];
  numberOfDislikes: number;
  dislikedBy: String[];
  numberOfComments: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  // virtual fields
  isSaved?: boolean;
}

export interface PostQuery {
  page: number;
  limit: number;
  userId?: string;
  groupId?: string;
  type?: 'random' | 'own' | 'saved' | 'group';
}

export interface CommentQuery {
  postId: string;
  page: number;
  limit: number;
}
