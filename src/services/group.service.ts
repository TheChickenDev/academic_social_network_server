import GroupModel from '../models/group.model';
import UserModel from '../models/user.model';
import { User } from '../interfaces/user.interface';
import { GroupMemberModel } from '../models/group.model';

const createGroup = (data: {
  email: string;
  name: string;
  description: string;
  cloudinaryUrls: string[];
  publicIds: string[];
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: data.email });
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

export default { createGroup };
