import { ObjectId } from 'mongoose';

interface MessageContent {
  type: 'text' | 'call' | 'missed-call';
  content: string;
}

export interface Message extends Document {
  _id?: ObjectId;
  conversationId: string;
  senderId: string;
  message: MessageContent[];
  createdAt?: Date;
  updatedAt?: Date;
}
