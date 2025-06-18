import mongoose, { Model, Schema } from 'mongoose';
import { Message } from '../interfaces/message.interface';
import ConversationModel from './conversation.model';
import { getSocketIO, getSocketId } from '../services/socket.service';

const messageSchema: Schema<Message> = new Schema(
  {
    conversationId: {
      type: String,
      ref: 'Conversation',
      required: true
    },
    senderId: {
      type: String,
      required: true
    },
    message: new Schema(
      {
        type: {
          type: String,
          enum: ['text', 'video-call', 'audio-call'],
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

messageSchema.post('save', async function (doc) {
  const conversation = await ConversationModel.findById(doc.conversationId);
  if (!conversation) {
    return;
  }
  const io = getSocketIO();
  conversation.userIds?.forEach((userId) => {
    const socketId = getSocketId(userId);
    if (socketId) {
      io?.to(socketId).emit('chat message', doc);
    }
  });
});

const MessageModel: Model<Message> = mongoose.model('Message', messageSchema);

export default MessageModel;
