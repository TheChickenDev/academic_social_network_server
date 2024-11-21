import ConversationModel from '../models/conversation.model';
import MessageModel from '../models/message.model';
import UserModel from '../models/user.model';

// create message

const createMessage = async ({
  conversationId,
  senderEmail,
  receiverEmail,
  type,
  content
}: {
  conversationId: string;
  senderEmail: string;
  receiverEmail: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'icon';
  content: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!conversationId) {
        const newConversation = await ConversationModel.create({
          userEmails: [senderEmail, receiverEmail]
        });
        const newMessage = await MessageModel.create({
          conversationId: newConversation._id,
          senderEmail,
          message: { type, content }
        });
        return resolve({
          message: 'Message created successfully!',
          data: newMessage
        });
      }
      const conversation = await ConversationModel.findById(conversationId);
      conversation.updatedAt = new Date();
      await conversation.save();
      const newMessage = await MessageModel.create({
        conversationId: conversationId,
        senderEmail,
        message: { type, content }
      });
      return resolve({
        message: 'Message created successfully!',
        data: newMessage
      });
    } catch (error) {
      throw new Error(error);
    }
  });
};

// get messages

const getMessages = async ({
  conversationId,
  userEmail,
  page,
  limit
}: {
  conversationId: string;
  userEmail: string;
  page: number;
  limit: number;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * limit;
      const messages = await MessageModel.find({ conversationId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
      const result = await Promise.all(
        messages.map(async (message) => {
          const senderAvatar = await UserModel.findOne({ email: message.senderEmail }).select('avatarImg');
          return {
            _id: message._id,
            conversationId: message.conversationId,
            senderEmail: message.senderEmail === userEmail ? 'You' : message.senderEmail,
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
      throw new Error(error);
    }
  });
};

export default { getMessages, createMessage };
