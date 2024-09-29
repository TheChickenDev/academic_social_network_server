import { ObjectId } from 'mongoose';

// group member
export interface GroupMember extends Document {
  groupId: ObjectId;
  groupName: string;
  role: 'Member' | 'Moderator' | 'Admin';
  contributionPoints: number;
  title: string;
  joinDate: Date;
}

// group
export interface Group extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  avatarImg: ImageData;
  backgroundImg: ImageData;
  ownerUsername: string;
  createdAt: Date;
  updatedAt: Date;
}
