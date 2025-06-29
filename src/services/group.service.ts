import GroupModel from '../models/group.model';
import UserModel from '../models/user.model';
import { User } from '../interfaces/user.interface';
import { GroupQuery } from '../interfaces/group.interface';
import PostModel from '../models/post.model';
import { Post } from '../interfaces/post.interface';

// create group

const createGroup = (data: {
  ownerId: string;
  name: string;
  description: string;
  cloudinaryUrls: string[];
  publicIds: string[];
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(data.ownerId);
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      let newGroupData: {
        name: string;
        description: string;
        avatarImg?: object;
        backgroundImg?: object;
        ownerId: string;
      } = {
        name: data.name,
        description: data.description,
        ownerId: user?._id.toString() ?? ''
      };
      if (data.cloudinaryUrls && data.cloudinaryUrls[0]) {
        newGroupData = { ...newGroupData, avatarImg: { url: data.cloudinaryUrls[0], publicId: data.publicIds[0] } };
      }
      if (data.cloudinaryUrls && data.cloudinaryUrls[1]) {
        newGroupData = { ...newGroupData, backgroundImg: { url: data.cloudinaryUrls[1], publicId: data.publicIds[1] } };
      }
      const newGroup = await GroupModel.create(newGroupData);
      await user?.save();
      resolve({
        message: 'Create group successful!',
        data: newGroup
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get groups for admin

const getGroupsForAdmin = ({ page, limit }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const safePage = page ?? 1;
      const safeLimit = limit ?? 10;
      const groups = await GroupModel.find()
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit);
      if (!groups) {
        return reject({
          message: 'Group not found!'
        });
      }
      return resolve({
        message: 'Get groups successful!',
        data: await Promise.all(
          groups.map(async (group) => {
            const owner = await UserModel.findById(group.ownerId).select('fullName avatarImg email');
            const groupObject = group.toObject();
            return {
              _id: groupObject._id,
              name: groupObject.name,
              isPrivate: groupObject.isPrivate,
              avatarImg: groupObject.avatarImg?.url,
              ownerName: owner?.fullName,
              ownerEmail: owner?.email,
              createdAt: groupObject.createdAt
            };
          })
        )
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get group by id

const getGroupById = ({ id, userId }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }

      const owner = await UserModel.findById(group.ownerId);
      const groupObject = group.toObject();
      const moderators = group.members?.filter((member) => member.role === 'moderator');
      const moderatorsData = await UserModel.find({ _id: { $in: moderators.map((mode) => mode.userId) } }).limit(10);
      const members = group.members?.filter((member) => member.role === 'member');
      const membersData = await UserModel.find({ _id: { $in: members.map((member) => member.userId) } })
        .sort({ join: -1 })
        .skip(0)
        .limit(10);

      const canJoin =
        !userId || group.ownerId === userId || group.members?.some((member) => member.userId === userId) ? false : true;
      const canPost =
        group.ownerId === userId || group.members?.some((member) => member.userId === userId) ? true : false;
      const canEdit =
        group.ownerId === userId ||
        group.members?.some((member) => member.userId === userId && member.role === 'moderator');
      return resolve({
        message: 'Get group successful!',
        data: {
          ...groupObject,
          avatarImg: groupObject.avatarImg?.url,
          ownerName: owner?.fullName,
          ownerAvatar: owner?.avatarImg?.url,
          ownerRank: owner?.rank,
          membersCount: membersData.length + moderatorsData.length,
          postsCount: group.posts?.length,
          members: membersData.map((member) => {
            const memberObject = member.toObject();
            return {
              userId: memberObject?._id,
              userName: memberObject?.fullName,
              userAvatar: memberObject?.avatarImg?.url ?? null,
              userRank: memberObject?.rank
            };
          }),
          moderators: moderatorsData.map((moderator) => {
            const moderatorObject = moderator.toObject();
            return {
              userId: moderatorObject?._id,
              userName: moderatorObject?.fullName,
              userAvatar: moderatorObject?.avatarImg?.url ?? null,
              userRank: moderatorObject?.rank
            };
          }),
          canJoin,
          canPost,
          canEdit
        }
      });
    } catch {}
  });
};

// get own groups

const getOwnGroups = ({ userId, page, limit }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const safePage = page ?? 1;
      const safeLimit = limit ?? 10;
      const groups = await GroupModel.find({ ownerId: userId })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit);
      if (!groups) {
        return reject({
          message: 'Group not found!'
        });
      }
      return resolve({
        message: 'Get groups successful!',
        data: groups.map((group) => {
          const groupObject = group.toObject();
          return {
            _id: groupObject._id,
            name: groupObject.name,
            isPrivate: groupObject.isPrivate,
            avatarImg: groupObject.avatarImg?.url
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get random groups (not own or member)

const getRandomGroups = ({ userId, page, limit }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const safePage = page ?? 1;
      const safeLimit = limit ?? 10;
      const skip = (safePage - 1) * safeLimit;
      const groups = await GroupModel.find({
        ownerId: { $ne: userId },
        'members.userId': { $nin: [userId] }
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit);
      if (!groups) {
        return reject({
          message: 'Group not found!'
        });
      }

      return resolve({
        message: 'Get groups successful!',
        data: groups.map((group) => {
          const groupObject = group.toObject();
          const canJoin =
            !userId || group.ownerId === userId || !group.members?.some((member) => member.userId === userId);
          return {
            _id: groupObject._id,
            name: groupObject.name,
            isPrivate: groupObject.isPrivate,
            avatarImg: groupObject.avatarImg?.url,
            canJoin
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get joined groups

const getJoinedGroups = ({ userId, page, limit }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const safePage = page ?? 1;
      const safeLimit = limit ?? 10;
      const skip = (safePage - 1) * safeLimit;
      const groups = await GroupModel.find({
        ownerId: { $ne: userId },
        'members.userId': { $in: [userId] }
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit);
      if (!groups) {
        return reject({
          message: 'Group not found!'
        });
      }
      return resolve({
        message: 'Get groups successful!',
        data: groups.map((group) => {
          const groupObject = group.toObject();
          return {
            _id: groupObject._id,
            name: groupObject.name,
            isPrivate: groupObject.isPrivate,
            avatarImg: groupObject.avatarImg?.url
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};

// delete group

const deleteGroup = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findByIdAndDelete(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      PostModel.deleteMany({ _id: { $in: group.posts?.map((post) => post.postId) } });
      return resolve({
        message: 'Delete group successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// update group

const updateGroup = (data: {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  cloudinaryUrls: string[];
  publicIds: string[];
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(data.id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      group.name = data.name;
      group.description = data.description;
      if (group.isPrivate === true && data.isPrivate === false) {
        group.members = group.members?.map((member) => {
          if (member.role === 'pending') {
            member.role = 'member';
            member.joinDate = new Date();
          }
          return member;
        });
        group.posts = group.posts?.map((post) => {
          post.status = 'approved';
          return post;
        });
      }
      group.isPrivate = data.isPrivate;
      if (data.cloudinaryUrls && data.cloudinaryUrls[0]) {
        group.avatarImg = { url: data.cloudinaryUrls[0], publicId: data.publicIds[0] };
      }
      if (data.cloudinaryUrls && data.cloudinaryUrls[1]) {
        group.backgroundImg = { url: data.cloudinaryUrls[1], publicId: data.publicIds[1] };
      }
      await group.save();
      return resolve({
        message: 'Update group successful!',
        data: {
          ...group.toObject(),
          avatarImg: group.avatarImg?.url
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get members

const getMembers = ({ id, memberRole, userId }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      let members = [];
      if (memberRole === 'all') {
        members = group.members;
      } else {
        members = group.members?.filter((member) => member.role === memberRole);
      }
      const membersData = await UserModel.find({ _id: { $in: members.map((member) => member.userId) } });
      return resolve({
        message: 'Get members successful!',
        data: membersData.map((member) => {
          const memberObject = member.toObject();
          const temp = members.find((mem) => mem.userId === memberObject._id.toString());
          if (userId && memberObject._id.toString() !== userId) {
            return {
              role: temp?.role,
              userId: memberObject?._id,
              userName: memberObject?.fullName,
              userAvatar: memberObject?.avatarImg?.url,
              userRank: memberObject?.rank,
              canAddFriend: memberObject.friends?.some((friend) => friend.friendId === userId) ? false : true,
              joinDate: temp?.joinDate
            };
          }
          return {
            role: temp?.role,
            userId: memberObject?._id,
            userName: memberObject?.fullName,
            userAvatar: memberObject?.avatarImg?.url,
            userRank: memberObject?.rank,
            canAddFriend: false,
            joinDate: temp?.joinDate
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};

// requestToJoin

const requestToJoin = ({ id, userId }: { id: string; userId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      if (group.members?.some((member) => member.userId === userId)) {
        return reject({
          message: 'You are already a member of this group!'
        });
      }
      if (group.isPrivate) {
        group.members?.push({
          userId,
          role: 'pending',
          joinDate: new Date()
        });
      } else {
        group.members?.push({
          userId,
          role: 'member',
          joinDate: new Date()
        });
      }
      await group.save();
      return resolve({
        message: 'Request to join successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// accept request

const acceptJoinRequest = ({ id, userId }: { id: string; userId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const member = group.members?.find((member) => member.userId === userId);
      if (!member) {
        return reject({
          message: 'Member not found!'
        });
      }
      member.role = 'member';
      member.joinDate = new Date();
      await group.save();
      return resolve({
        message: 'Accept request successful!',
        data: member
      });
    } catch (error) {
      reject(error);
    }
  });
};

// remove member

const removeMember = ({ id, userId }: { id: string; userId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const memberIndex = group.members?.findIndex((member) => member.userId === userId);
      if (memberIndex === -1) {
        return reject({
          message: 'Member not found!'
        });
      }
      group.members?.splice(memberIndex, 1);
      await group.save();
      return resolve({
        message: 'Remove member successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// appoint moderator

const appointModerator = ({ id, userId }: { id: string; userId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const member = group.members?.find((member) => member.userId === userId);
      if (!member) {
        return reject({
          message: 'Member not found!'
        });
      }
      member.role = 'moderator';
      await group.save();
      return resolve({
        message: 'Appoint member successful!',
        data: member
      });
    } catch (error) {
      reject(error);
    }
  });
};

// dismissal moderator

const dismissalModerator = ({ id, userId }: { id: string; userId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const member = group.members?.find((member) => member.userId === userId);
      if (!member) {
        return reject({
          message: 'Member not found!'
        });
      }
      member.role = 'member';
      await group.save();
      return resolve({
        message: 'Dismissal member successful!',
        data: member
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get posts

const getPosts = ({ id, postStatus }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      let postsData = [];
      if (postStatus === 'all') {
        postsData = await PostModel.find({ _id: { $in: group.posts.map((p) => p.postId) } });
      } else {
        const filteredPosts = group.posts?.filter((post) => post.status === postStatus);
        postsData = await PostModel.find({ _id: { $in: filteredPosts.map((p) => p.postId) } });
      }
      return resolve({
        message: 'Get posts successful!',
        data: await Promise.all(
          postsData.map(async (post: Post) => {
            const user = await UserModel.findById(post.ownerId).select('fullName _id avatarImg');
            return {
              _id: post._id,
              title: post.title,
              ownerName: user?.fullName,
              ownerId: user?._id,
              ownerAvatar: user?.avatarImg?.url,
              createdAt: post.createdAt
            };
          })
        )
      });
    } catch (error) {
      reject(error);
    }
  });
};

// approve post

const approvePost = ({ id, postId }: { id: string; postId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const post = group.posts?.find((p) => p.postId.toString() === postId);
      if (!post) {
        return reject({
          message: 'Post not found!'
        });
      }
      post.status = 'approved';
      await group.save();
      return resolve({
        message: 'Approve post successful!',
        data: post
      });
    } catch (error) {
      reject(error);
    }
  });
};

// reject post

const rejectPost = ({ id, postId }: { id: string; postId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const postIndex = group.posts?.findIndex((p) => p.postId === postId);
      if (postIndex === -1) {
        return reject({
          message: 'Post not found!'
        });
      }
      group.posts?.splice(postIndex, 1);
      await group.save();
      return resolve({
        message: 'reject post successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createGroup,
  getGroupById,
  getGroupsForAdmin,
  getOwnGroups,
  getRandomGroups,
  getJoinedGroups,
  deleteGroup,
  updateGroup,
  getMembers,
  requestToJoin,
  acceptJoinRequest,
  removeMember,
  appointModerator,
  dismissalModerator,
  getPosts,
  approvePost,
  rejectPost
};
