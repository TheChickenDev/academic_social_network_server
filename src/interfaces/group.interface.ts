import { ObjectId } from 'mongoose';
import { ImageData } from './utils.interface';

// group member
export interface GroupMember {
  userId: string;
  role: 'pending' | 'member' | 'moderator' | 'admin';
  joinDate: Date;
}

//

export interface GroupPost {
  postId: string;
  status: 'pending' | 'approved' | 'rejected';
}

// group
export interface Group extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  avatarImg: ImageData;
  backgroundImg: ImageData;
  isPrivate: boolean;
  ownerId: string;
  members: GroupMember[];
  posts: GroupPost[];
  createdAt: Date;
  updatedAt: Date;
}

// group post
export interface GroupQuery {
  id?: string;
  userId?: string;
  page?: number;
  limit?: number;
  type?: 'byId' | 'own' | 'joined' | 'random';
  memberRole?: 'pending' | 'member' | 'moderator' | 'admin' | 'all';
  postStatus?: 'pending' | 'approved' | 'rejected' | 'all';
}
