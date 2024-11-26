import { TokenPayload } from '../interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../interfaces/user.interface';
import UserModel from '../models/user.model';
dotenv.config();

const generateAccessToken = async (payload: TokenPayload) => {
  const access_token = jwt.sign(
    {
      ...payload
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '5m' }
  );
  return access_token;
};

const generateRefreshToken = async (payload: TokenPayload) => {
  const refresh_token = jwt.sign(
    {
      ...payload
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: '365d' }
  );
  return refresh_token;
};

export const refreshTokenService = (token: string) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user: TokenPayload) => {
        if (err) {
          resolve({
            status: 'ERR',
            message: 'THE AUTHENTICATION'
          });
        }
        const access_token = await generateAccessToken({
          _id: user?._id,
          email: user?.email,
          isAdmin: user?.isAdmin,
          fullName: user?.fullName,
          avatar: user?.avatar
        });
        UserModel.findById(user._id).then((res: User) => {
          res.accessToken = access_token;
          res.save();
        });
        resolve({
          status: 'OK',
          message: 'REFRESH TOKEN SUCCESSFUL',
          data: access_token
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const generateResetPasswordToken = async (email: string) => {
  const currentDate = new Date();
  let randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const reset_token = jwt.sign(
    {
      email,
      key: randomNumber,
      date: currentDate.toISOString()
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '10m' }
  );
  return { reset_token, randomNumber };
};

export default {
  generateAccessToken,
  generateRefreshToken
};
