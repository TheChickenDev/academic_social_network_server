import { Schema } from 'mongoose';
import { Group, GroupMember } from '../interfaces/group.interface';
import mongoose from 'mongoose';
import { ImageSchema } from './utils.model';

const groupSchema: Schema<Group> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    avatarImg: { type: ImageSchema, required: false, default: null },
    backgroundImg: { type: ImageSchema, required: false, default: null },
    members: [
      new Schema(
        {
          userEmail: { type: String, required: true },
          role: { type: String, enum: ['pending', 'member', 'moderator', 'admin'], required: true },
          joinDate: { type: Date, default: Date.now }
        },
        { _id: false }
      )
    ],
    posts: [
      new Schema(
        {
          postId: { type: Schema.Types.ObjectId, required: true },
          status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true }
        },
        { _id: false }
      )
    ],
    isPrivate: { type: Boolean, required: true, default: false },
    ownerEmail: { type: String, required: true }
  },
  { timestamps: true }
);

const GroupModel = mongoose.model<Group>('Group', groupSchema);

export default GroupModel;
