import ConversationModel from '../models/conversation.model';
import MessageModel from '../models/message.model';
import UserModel from '../models/user.model';

// create message

const createMessage = async ({
  conversationId,
  senderId,
  receiverId,
  type,
  content
}: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  type: 'text' | 'call' | 'missed-call';
  content: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!conversationId) {
        const newConversation = await ConversationModel.create({
          userIds: [senderId, receiverId]
        });
        const newMessage = await MessageModel.create({
          conversationId: newConversation._id,
          senderId,
          message: { type, content }
        });
        return resolve({
          message: 'Message created successfully!',
          data: newMessage
        });
      }
      const conversation = await ConversationModel.findById(conversationId);
      if (!conversation) {
        return reject(new Error('Conversation not found'));
      }
      conversation.updatedAt = new Date();
      await conversation.save();
      const newMessage = await MessageModel.create({
        conversationId: conversationId,
        senderId,
        message: { type, content }
      });
      return resolve({
        message: 'Message created successfully!',
        data: newMessage
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  });
};

// get messages

const getMessages = async ({
  conversationId,
  userId,
  page,
  limit
}: {
  conversationId: string;
  userId: string;
  page: number;
  limit: number;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * limit;
      const messages = await MessageModel.find({ conversationId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
      const result = await Promise.all(
        messages.map(async (message) => {
          const senderAvatar = await UserModel.findById(message.senderId).select('avatarImg');
          return {
            _id: message._id,
            conversationId: message.conversationId,
            senderId: message.senderId === userId ? 'You' : message.senderId,
            senderAvatar: senderAvatar?.avatarImg?.url ?? null,
            message: message.message,
            createdAt: message.createdAt
          };
        })
      );
      return resolve({
        message: 'Messages found!',
        data: result
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  });
};

export default { getMessages, createMessage };
