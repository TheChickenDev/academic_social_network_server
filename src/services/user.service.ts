import UserModel from '../models/user.model';
import { User, CreateUserInput, UpdateUserInput } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwtService from './jwt';

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

const updateUser = (data: UpdateUserInput, cloudinaryUrls: string[], publicIds: string[]) => {
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

      if (cloudinaryUrls && cloudinaryUrls[0]) {
        newData = { ...newData, avatarImg: { url: cloudinaryUrls[0], publicId: publicIds[0] } };
      }
      if (cloudinaryUrls && cloudinaryUrls[1]) {
        newData = { ...newData, backgroundImg: { url: cloudinaryUrls[1], publicId: publicIds[1] } };
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

export default { createUser, login, updateUser };
