import { ObjectId } from 'mongoose';

export interface Conversation extends Document {
  _id?: ObjectId;
  userEmails: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
