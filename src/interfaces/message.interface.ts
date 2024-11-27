import { ObjectId } from 'mongoose';

interface MessageContent {
  type: 'text' | 'image' | 'video' | 'audio' | 'icon';
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
