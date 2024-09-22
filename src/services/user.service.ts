import UserModel from '../models/user.model';
import { User, UserInput } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwtService from './jwt';

const createUser = (newUserData: UserInput, avatar: string = '', background: string = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { username, password, fullName, dateOfBirth, gender, introduction } = newUserData;
      const hashPassword = bcrypt.hashSync(password, 12);

      const newUser = await UserModel.create({
        username,
        password: hashPassword,
        fullName,
        dateOfBirth,
        gender,
        introduction,
        avatar
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
          id: user._id,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          avatarURL: user.avatarURL,
          backgroundURL: user.backgroundURL
        });
        const refresh_token = await jwtService.generateRefreshToken({
          id: user._id,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          avatarURL: user.avatarURL,
          backgroundURL: user.backgroundURL
        });
        await UserModel.findByIdAndUpdate(user._id, { accessToken: access_token, refreshToken: refresh_token });
        resolve({
          message: 'Login successful!',
          data: {
            access_token,
            refresh_token,
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            introduction: user.introduction,
            avatarURL: user.avatarURL,
            backgroundURL: user.backgroundURL
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { createUser, login };
