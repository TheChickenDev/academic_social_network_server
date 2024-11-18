import { Schema } from 'mongoose';
import { Group, GroupMember } from '../interfaces/group.interface';
import mongoose from 'mongoose';
import { ImageSchema } from './utils.model';

export const groupMemberSchema: Schema<GroupMember> = new Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
    groupName: { type: String, required: true },
    role: { type: String, enum: ['Member', 'Moderator', 'Admin'], required: true },
    contributionPoints: { type: Number, default: 0 },
    title: { type: String, required: false, default: null },
    joinDate: { type: Date, default: Date.now }
  },
  { _id: false }
);

const groupSchema: Schema<Group> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    avatarImg: { type: ImageSchema, required: false, default: null },
    backgroundImg: { type: ImageSchema, required: false, default: null },
    ownerEmail: { type: String, required: true }
  },
  { timestamps: true }
);

const GroupModel = mongoose.model<Group>('Group', groupSchema);

export default GroupModel;

export const GroupMemberModel = mongoose.model<GroupMember>('GroupMember', groupMemberSchema);
