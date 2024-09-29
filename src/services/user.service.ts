import UserModel, { FollowerModel } from '../models/user.model';
import { User, CreateUserInput, UpdateUserInput } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwtService from './jwt';
import GroupModel, { GroupMemberModel } from '../models/group.model';

const createUser = (newUserData: CreateUserInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { username, password } = newUserData;
      const hashPassword = bcrypt.hashSync(password, 12);

      const existUsername = await UserModel.findOne({ username });
      if (existUsername) {
        reject({
          message: 'Username already exists!'
        });
      }

      const newUser = await UserModel.create({
        username,
        password: hashPassword
      });
      resolve({
        message: 'Create account successful!',
        data: newUser
      });
    } catch (error) {
      reject(error);
    }
  });
};

const login = (username: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ username });
      if (!user) {
        resolve({
          message: 'Account does not exist!'
        });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        resolve({
          message: 'Incorrect password!'
        });
      } else {
        const access_token = await jwtService.generateAccessToken({
          username: user.username,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          avatarImg: user.avatarImg,
          backgroundImg: user.backgroundImg,
          introduction: user.introduction
        });
        const refresh_token = await jwtService.generateRefreshToken({
          username: user.username,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          avatarImg: user.avatarImg,
          backgroundImg: user.backgroundImg,
          introduction: user.introduction
        });
        await UserModel.findByIdAndUpdate(user._id, { accessToken: access_token, refreshToken: refresh_token });
        resolve({
          message: 'Login successful!',
          data: {
            access_token,
            refresh_token
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const loginWithGoogle = (data: { email: string; name: string; googleId: string; avatar: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user: User = await UserModel.findOne({ googleId: data.googleId });
      if (!user) {
        const hashPassword = bcrypt.hashSync(data.email + data.googleId, 12);
        user = await UserModel.create({
          googleId: data.googleId,
          username: '__' + data.googleId,
          password: hashPassword,
          avatarImg: { url: data.avatar, publicId: '' },
          introduction: {
            contact: {
              email: data.email
            }
          }
        });
      }
      const access_token = await jwtService.generateAccessToken({
        username: user.username,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        avatarImg: user.avatarImg,
        backgroundImg: user.backgroundImg,
        introduction: user.introduction
      });
      const refresh_token = await jwtService.generateRefreshToken({
        username: user.username,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        avatarImg: user.avatarImg,
        backgroundImg: user.backgroundImg,
        introduction: user.introduction
      });
      await UserModel.findByIdAndUpdate(user._id, { accessToken: access_token, refreshToken: refresh_token });
      resolve({
        message: 'Login successful!',
        data: {
          access_token,
          refresh_token
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = (data: UpdateUserInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { username, introduction } = data;

      if (introduction?.contact?.email) {
        const user: User = await UserModel.findOne({ 'introduction.contact.email': introduction.contact.email });
        if (user && user.username !== username) {
          reject({
            message: 'Email already exists!'
          });
        }
      }

      if (introduction?.contact?.phone) {
        const user: User = await UserModel.findOne({ 'introduction.contact.phone': introduction.contact.phone });
        if (user && user.username !== username) {
          reject({
            message: 'Phone already exists!'
          });
        }
      }

      let newData: {
        fullName: string;
        dateOfBirth: Date;
        gender: string;
        introduction?: object;
        avatarImg?: object;
        backgroundImg?: object;
      } = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender
      };

      if (introduction?.contact || introduction?.address || introduction?.educations || introduction?.jobs) {
        newData = { ...newData, introduction };
      }

      if (data.cloudinaryUrls && data.cloudinaryUrls[0]) {
        newData = { ...newData, avatarImg: { url: data.cloudinaryUrls[0], publicId: data.publicIds[0] } };
      }
      if (data.cloudinaryUrls && data.cloudinaryUrls[1]) {
        newData = { ...newData, backgroundImg: { url: data.cloudinaryUrls[1], publicId: data.publicIds[1] } };
      }

      const user: User = await UserModel.findOneAndUpdate({ username }, newData, { new: true });

      if (!user) {
        reject({
          message: 'User not found!'
        });
      }

      resolve({
        message: 'Update user successful!',
        data: user
      });
    } catch (error) {
      reject(error);
    }
  });
};

const blockUser = (data: { username: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ username: data.username });
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      user.isActive = false;
      await user.save();
      resolve({
        message: 'Block user successful!',
        data: user
      });
    } catch (error) {
      reject(error);
    }
  });
};

const followUser = (data: { username: string; followedUsername: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followedUser: User = await UserModel.findOne({ username: data.followedUsername });
      if (!followedUser) {
        reject({
          message: 'Followed user not found!'
        });
      }
      const user: User = await UserModel.findOne({ username: data.username });
      const newFollower = new FollowerModel({
        followerUsername: user.username,
        followDate: new Date(),
        followerName: user.fullName,
        followerAvatar: user.avatarImg
      });

      followedUser.followers.push(newFollower);

      await followedUser.save();
      resolve({
        message: 'Block user successful!',
        data: followedUser
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createGroup = (data: {
  username: string;
  name: string;
  description: string;
  cloudinaryUrls: string[];
  publicIds: string[];
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ username: data.username });
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
        ownerUsername: string;
      } = {
        name: data.name,
        description: data.description,
        ownerUsername: user.username
      };
      if (data.cloudinaryUrls && data.cloudinaryUrls[0]) {
        newGroupData = { ...newGroupData, avatarImg: { url: data.cloudinaryUrls[0], publicId: data.publicIds[0] } };
      }
      if (data.cloudinaryUrls && data.cloudinaryUrls[1]) {
        newGroupData = { ...newGroupData, backgroundImg: { url: data.cloudinaryUrls[1], publicId: data.publicIds[1] } };
      }
      const newGroup = await GroupModel.create(newGroupData);
      console.log({ groupId: newGroup._id, groupName: newGroup.name, role: 'Admin' });
      user.groups.push(new GroupMemberModel({ groupId: newGroup._id, groupName: newGroup.name, role: 'Admin' }));
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

export default { createUser, login, loginWithGoogle, updateUser, blockUser, followUser, createGroup };
