import { ObjectId } from 'mongoose';

// post content

export interface PostContent {
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'link' | 'code';
}

// post

export interface Post {
  _id: ObjectId;
  content: string[];
}
