import mongoose, { Model, Schema } from 'mongoose';
import { Conversation } from '../interfaces/conversation.interface';

const conversationSchema: Schema<Conversation> = new Schema(
  {
    userIds: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

const ConversationModel: Model<Conversation> = mongoose.model('Conversation', conversationSchema);

export default ConversationModel;
