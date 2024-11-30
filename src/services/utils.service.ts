// search all

import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import GroupModel from '../models/group.model';
import { Post } from '../interfaces/post.interface';
import { SearchQueryParams } from '../interfaces/utils.interface';
import { User } from '../interfaces/user.interface';
import { Group } from '../interfaces/group.interface';
import RankModel from '../models/rank.model';

export const updateUserRank = (additionalPoints: number, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(userId);
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

export const searchAll = ({ q, userId }: { q: string; userId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await PostModel.find({ title: { $regex: new RegExp(q, 'i') } })
        .limit(10)
        .skip(0)
        .exec();
      const user = await UserModel.findById(userId).select('friends');
      const exceptIds = [userId];
      const users = await UserModel.find({
        _id: {
          $nin: exceptIds
        },
        $or: [{ fullName: { $regex: new RegExp(q, 'i') } }]
      })
        .select('_id fullName points rank avatarImg')
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10);
      const groups = await GroupModel.find({
        'members.userId': { $nin: [userId] },
        $or: [{ name: { $regex: new RegExp(q, 'i') } }]
      })
        .skip(0)
        .limit(10);
      resolve({
        message: 'Search successfully!',
        data: {
          posts: await Promise.all(
            posts.map(async (post) => {
              const postObject = post.toObject();
              const owner = await UserModel.findById(postObject.ownerId).select('fullName avatarImg');
              return { ...postObject, ownerName: owner?.fullName, ownerAvatar: owner?.avatarImg?.url };
            })
          ),
          users: users.map((u) => ({
            ...u.toObject(),
            avatarImg: u.avatarImg?.url ?? null,
            canAddFriend: !user?.friends?.some((f) => f.friendId === u._id.toString())
          })),
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
        data: await Promise.all(
          posts.map(async (post) => {
            const owner = await UserModel.findById(post.ownerId).select('fullName avatarImg');
            return {
              ...post.toObject(),
              ownerName: owner?.fullName,
              ownerAvatar: owner?.avatarImg?.url
            };
          })
        )
      });
    } catch (error) {
      reject(error);
    }
  });
};

// search users

export const searchUsers = ({ q, filter, page, limit, userId }: SearchQueryParams) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(userId).select('friends');
      let users: User[] = [];
      const skip = (page - 1) * limit;
      switch (filter) {
        case 'rank':
          users = await UserModel.find({
            _id: {
              $nin: [userId]
            },
            fullName: { $regex: new RegExp(q, 'i') }
          })
            .select('_id fullName points rank avatarImg')
            .sort({ points: -1 })
            .skip(skip)
            .limit(limit);
          break;
        default:
          users = await UserModel.find({
            _id: {
              $nin: [userId]
            },
            fullName: { $regex: new RegExp(q, 'i') }
          })
            .select('_id fullName points rank avatarImg')
            .skip(0)
            .limit(10);

          break;
      }
      resolve({
        message: 'Search successfully!',
        data: users.map((u) => ({
          ...u.toObject(),
          avatarImg: u.avatarImg?.url ?? null,
          canAddFriend: !user?.friends?.some((f) => f.friendId === u._id.toString())
        }))
      });
    } catch (error) {
      reject(error);
    }
  });
};

// search groups

export const searchGroups = ({ q, filter, page, limit, userId }: SearchQueryParams) => {
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
            canJoin: !group.members?.some((m) => m.userId === userId) && group.ownerId !== userId
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};
