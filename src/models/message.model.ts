import mongoose, { Model, Schema } from 'mongoose';
import { Message } from '../interfaces/message.interface';

const messageSchema: Schema<Message> = new Schema(
  {
    conversationId: {
      type: String,
      ref: 'Conversation',
      required: true
    },
    senderEmail: {
      type: String,
      required: true
    },
    message: new Schema(
      {
        type: {
          type: String,
          enum: ['text', 'image', 'video', 'audio', 'icon'],
          required: true
        },
        content: {
          type: String,
          required: true
        }
      },
      { _id: false }
    )
  },
  { timestamps: true }
);

const MessageModel: Model<Message> = mongoose.model('Message', messageSchema);

export default MessageModel;
