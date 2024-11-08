import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../interfaces/auth.interface';
import UserModel from '../models/user.model';

dotenv.config();

const authAdminMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  let token: string | string[] = req.headers.access_token;
  if (!token) {
    return res.status(401).json({
      message: 'THE AUTHORIZATION'
    });
  }
  if (token && typeof token === 'string') {
    token = token.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: Error, user: TokenPayload | undefined) => {
      if (err) {
        return res.status(401).json({
          message: 'THE AUTHORIZATION'
        });
      }
      if (user?.isAdmin) {
        next();
      } else {
        return res.status(401).json({
          message: 'THE AUTHORIZATION'
        });
      }
    });
  }
};

const authUserMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  let token: string | string[] = req.headers.access_token;
  if (!token) {
    return res.status(401).json({
      message: 'THE AUTHORIZATION'
    });
  }
  if (token && typeof token === 'string') {
    token = token.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN as string, async (err: Error, user: TokenPayload | undefined) => {
      if (err) {
        return res.status(401).json({
          message: 'THE AUTHORIZATION'
        });
      }
      const existUser = await UserModel.findOne({ email: user?.email }, 'email');
      if (!existUser) {
        return res.status(401).json({
          message: 'THE AUTHORIZATION'
        });
      }
      if (user?.isAdmin || user?.email === existUser?.email) {
        next();
      } else {
        return res.status(401).json({
          message: 'THE AUTHORIZATION'
        });
      }
    });
  }
};

export { authAdminMiddleware, authUserMiddleware };
