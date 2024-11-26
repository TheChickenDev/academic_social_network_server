import { ObjectId } from 'mongoose';

export interface Conversation extends Document {
  _id?: ObjectId;
  userIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
