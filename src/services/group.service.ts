import GroupModel from '../models/group.model';
import UserModel from '../models/user.model';
import { User } from '../interfaces/user.interface';
import { GroupQuery } from '../interfaces/group.interface';

// create group

const createGroup = (data: {
  ownerEmail: string;
  name: string;
  description: string;
  cloudinaryUrls: string[];
  publicIds: string[];
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: data.ownerEmail });
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
        ownerEmail: string;
      } = {
        name: data.name,
        description: data.description,
        ownerEmail: user.email
      };
      if (data.cloudinaryUrls && data.cloudinaryUrls[0]) {
        newGroupData = { ...newGroupData, avatarImg: { url: data.cloudinaryUrls[0], publicId: data.publicIds[0] } };
      }
      if (data.cloudinaryUrls && data.cloudinaryUrls[1]) {
        newGroupData = { ...newGroupData, backgroundImg: { url: data.cloudinaryUrls[1], publicId: data.publicIds[1] } };
      }
      const newGroup = await GroupModel.create(newGroupData);
      await user.save();
      resolve({
        message: 'Create group successful!',
        data: newGroup
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get group

const getGroups = ({ id, ownerEmail, userEmail }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        const group = await GroupModel.findById(id);
        if (!group) {
          return reject({
            message: 'Group not found!'
          });
        }

        const owner = await UserModel.findOne({ email: group.ownerEmail });
        const groupObject = group.toObject();
        const moderators = group.members?.filter((member) => member.role === 'moderator');
        const moderatorsData = await UserModel.find({ email: { $in: moderators.map((mode) => mode.userEmail) } });
        const members = group.members?.filter((member) => member.role === 'member');
        const membersData = await UserModel.find({ email: { $in: members.map((member) => member.userEmail) } })
          .sort({ join: -1 })
          .skip(0)
          .limit(20);

        const canJoin =
          !userEmail ||
          group.ownerEmail === userEmail ||
          group.members?.some((member) => member.userEmail === userEmail)
            ? false
            : true;
        const canPost =
          group.ownerEmail === userEmail || group.members?.some((member) => member.userEmail === userEmail)
            ? true
            : false;
        return resolve({
          message: 'Get group successful!',
          data: {
            ...groupObject,
            avatarImg: groupObject.avatarImg?.url,
            ownerName: owner?.fullName,
            ownerAvatar: owner?.avatarImg?.url,
            ownerRank: owner?.rank,
            members: membersData.map((member) => {
              const memberObject = member.toObject();
              return {
                userEmail: memberObject?.email,
                userName: memberObject?.fullName,
                userAvatar: memberObject?.avatarImg?.url ?? null,
                userRank: memberObject?.rank
              };
            }),
            moderators: moderatorsData.map((moderator) => {
              const moderatorObject = moderator.toObject();
              return {
                userEmail: moderatorObject?.email,
                userName: moderatorObject?.fullName,
                userAvatar: moderatorObject?.avatarImg?.url ?? null,
                userRank: moderatorObject?.rank
              };
            }),
            canJoin,
            canPost
          }
        });
      } else if (ownerEmail) {
        const group = await GroupModel.findOne({ ownerEmail });
        if (!group) {
          return reject({
            message: 'Group not found!'
          });
        }
        return resolve({
          message: 'Get group successful!',
          data: group
        });
      }
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
      group.isPrivate = data.isPrivate;
      console.log(data.cloudinaryUrls);
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

const getMembers = ({ id, memberRole }: GroupQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        return reject({
          message: 'Group not found!'
        });
      }
      const members = group.members?.filter((member) => member.role === memberRole);
      const membersData = await UserModel.find({ email: { $in: members.map((member) => member.userEmail) } });
      return resolve({
        message: 'Get members successful!',
        data: membersData.map((member) => {
          const memberObject = member.toObject();
          return {
            userEmail: memberObject?.email,
            userName: memberObject?.fullName,
            userAvatar: memberObject?.avatarImg?.url
          };
        })
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default { createGroup, getGroups, updateGroup, getMembers };
