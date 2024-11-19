import { ObjectId } from 'mongoose';
import { ImageData } from './utils.interface';

// group member
export interface GroupMember {
  userEmail: string;
  role: 'pending' | 'member' | 'moderator' | 'admin';
  joinDate: Date;
}

//

export interface GroupPost {
  postId: ObjectId;
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
  ownerEmail: string;
  members: GroupMember[];
  posts: GroupPost[];
  createdAt: Date;
  updatedAt: Date;
}

// group post
export interface GroupQuery {
  id: string;
  ownerEmail?: string;
  userEmail?: string;
  memberRole?: 'member' | 'moderator' | 'admin';
}
