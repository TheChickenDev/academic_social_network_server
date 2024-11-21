import UserModel from '../models/user.model';
import { Conversation } from '../interfaces/conversation.interface';
import ConversationModel from '../models/conversation.model';
import { User } from '../interfaces/user.interface';
import MessageModel from '../models/message.model';

// get conversations

const getConversations = async ({ userEmail, page, limit }: { userEmail: string; page: number; limit: number }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: userEmail });
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      const friends = await UserModel.find({
        email: { $in: user.friends.filter((f) => f.status === 'accepted').map((f) => f.friendEmail) }
      }).select('email fullName rank avatarImg');

      const conversations = await ConversationModel.find({
        userEmails: { $elemMatch: { $eq: userEmail } }
      }).sort({ updatedAt: -1 });
      const result = await Promise.all(
        friends.map(async (f) => {
          const existConversation = conversations.find((c: Conversation) => c.userEmails.includes(f.email));
          if (existConversation) {
            const lastMessage = await MessageModel.findOne({ conversationId: existConversation._id }).sort({
              createdAt: -1
            });
            return {
              _id: existConversation._id,
              userEmail: f.email,
              userRank: f.rank,
              userName: f.fullName,
              avatarImg: f.avatarImg?.url ?? null,
              lastMessage: lastMessage?.message
            };
          }
          return {
            _id: null,
            userEmail: f.email,
            userRank: f.rank,
            userName: f.fullName,
            avatarImg: f.avatarImg?.url ?? null,
            lastMessage: null
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

export default {
  getConversations
};
