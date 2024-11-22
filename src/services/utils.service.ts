// search all

import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import GroupModel from '../models/group.model';
import { Post } from '../interfaces/post.interface';
import { SearchQueryParams } from '../interfaces/utils.interface';
import { User } from '../interfaces/user.interface';
import { Group } from '../interfaces/group.interface';
import RankModel from '../models/rank.model';

export const updateUserRank = (additionalPoints: number, email: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        const rank = await RankModel.findOne({ point: { $lte: user.points + additionalPoints } }).sort({ point: -1 });
        user.rank = rank?.name ? rank.name : '';
        user.points += additionalPoints;
        user.save();
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const searchAll = ({ q, email }: { q: string; email: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await PostModel.find({ title: { $regex: new RegExp(q, 'i') } })
        .limit(10)
        .skip(0)
        .exec();
      const user = await UserModel.findOne({ email }).select('friends');
      const exceptEmails = [...(user?.friends.map((f) => f.friendEmail) ?? []), email];
      const users = await UserModel.find({
        email: {
          $nin: exceptEmails
        },
        $or: [{ fullName: { $regex: new RegExp(q, 'i') } }, { email: { $regex: new RegExp(q, 'i') } }]
      })
        .select('email fullName points rank avatarImg')
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10);
      const groups = await GroupModel.find({
        'members.userEmail': { $nin: [email] },
        $or: [{ name: { $regex: new RegExp(q, 'i') } }, { ownerEmail: { $regex: new RegExp(q, 'i') } }]
      })
        .skip(0)
        .limit(10);
      resolve({
        message: 'Search successfully!',
        data: {
          posts,
          users: users.map((user) => ({ ...user.toObject(), avatarImg: user.avatarImg?.url ?? null })),
          groups: groups.map((group) => {
            const groupObject = group.toObject();
            return {
              _id: groupObject._id,
              name: groupObject.name,
              isPrivate: groupObject.isPrivate,
              avatarImg: groupObject.avatarImg?.url
            };
          })
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// search posts

export const searchPosts = ({ q, filter, page, limit }: SearchQueryParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      let posts: Post[] = [];
      const skip = (page - 1) * limit;
      switch (filter) {
        case 'newest':
          posts = await PostModel.find({ title: { $regex: new RegExp(q, 'i') }, groupId: '' })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
          break;
        case 'liked':
          posts = await PostModel.find({ title: { $regex: new RegExp(q, 'i') }, groupId: '' })
            .sort({ numberOfLikes: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
          break;
        case 'disliked':
          posts = await PostModel.find({ title: { $regex: new RegExp(q, 'i') }, groupId: '' })
            .sort({ numberOfDislikes: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
          break;
        default:
          posts = await PostModel.find({ title: { $regex: new RegExp(q, 'i') }, groupId: '' })
            .limit(limit)
            .skip(skip)
            .exec();
          break;
      }
      resolve({
        message: 'Search successfully!',
        data: posts
      });
    } catch (error) {
      reject(error);
    }
  });
};

// search users

export const searchUsers = ({ q, filter, page, limit, email }: SearchQueryParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email }).select('friends');
      let users: User[] = [];
      const skip = (page - 1) * limit;
      switch (filter) {
        case 'rank':
          users = await UserModel.find({
            email: {
              $nin: [email]
            },
            $or: [{ fullName: { $regex: new RegExp(q, 'i') } }, { email: { $regex: new RegExp(q, 'i') } }]
          })
            .select('email fullName points rank avatarImg')
            .sort({ points: -1 })
            .skip(skip)
            .limit(limit);
          break;
        default:
          users = await UserModel.find({
            email: {
              $nin: [email]
            },
            $or: [{ fullName: { $regex: new RegExp(q, 'i') } }, { email: { $regex: new RegExp(q, 'i') } }]
          })
            .select('email fullName points rank avatarImg')
            .skip(0)
            .limit(10);

          break;
      }
      resolve({
        message: 'Search successfully!',
        data: users.map((u) => ({
          ...u.toObject(),
          avatarImg: u.avatarImg?.url ?? null,
          canAddFriend: !user.friends?.some((f) => f.friendEmail === u.email)
        }))
      });
    } catch (error) {
      reject(error);
    }
  });
};

// search groups

export const searchGroups = ({ q, filter, page, limit, email }: SearchQueryParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      let groups: Group[] = [];
      const skip = (page - 1) * limit;
      switch (filter) {
        case 'newest':
          groups = await GroupModel.find({
            $or: [{ name: { $regex: new RegExp(q, 'i') } }, { ownerEmail: { $regex: new RegExp(q, 'i') } }]
          })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
          break;
        default:
          groups = await GroupModel.find({
            $or: [{ name: { $regex: new RegExp(q, 'i') } }, { ownerEmail: { $regex: new RegExp(q, 'i') } }]
          })
            .skip(skip)
            .limit(limit);
          break;
      }
      resolve({
        message: 'Search successfully!',
        data: groups.map((group) => {
          return {
            _id: group._id,
            name: group.name,
            isPrivate: group.isPrivate,
            avatarImg: group.avatarImg?.url,
            canJoin: !group.members?.some((m) => m.userEmail === email) && group.ownerEmail !== email
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};
