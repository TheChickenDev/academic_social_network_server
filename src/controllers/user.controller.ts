import { Request, Response } from 'express';
import userService from '../services/user.service';
import { isValidInputPassword } from '../utils/user.utils';
import { v2 as cloudinary } from 'cloudinary';
import { refreshTokenService } from '../services/jwt';

// create user
export const createUser = async (request: Request, response: Response) => {
  try {
    const { password, confirmPassword } = request.body;
    if (isValidInputPassword(password) === false) {
      return response.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character!'
      });
    }
    if (password !== confirmPassword) {
      return response.status(400).json({
        message: 'Password and confirm password do not match!'
      });
    }
    const result = await userService.createUser(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// login
export const login = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const result = await userService.login(email, password);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// login with google
export const loginWithGoogle = async (request: Request, response: Response) => {
  try {
    const result = await userService.loginWithGoogle(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// update user
export const updateUser = async (request: Request, response: Response) => {
  try {
    const result = await userService.updateUser(request.body);
    return response.status(200).json(result);
  } catch (error) {
    if (request.body.publicId) {
      await cloudinary.uploader.destroy(request.body.publicId);
    }
    return response.status(400).json({
      message: error.message
    });
  }
};

// get user
export const getUser = async (request: Request, response: Response) => {
  try {
    const { email } = request.query;
    const result = await userService.getUser({
      email: email as string
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// block user
export const blockUser = async (request: Request, response: Response) => {
  try {
    const result = await userService.blockUser(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// refresh token
export const refreshToken = async (request: Request, response: Response) => {
  try {
    const token = (request.headers.refresh_token as string)?.split(' ')[1];
    if (!token) {
      return response.status(200).json({
        status: 'ERR',
        message: 'The token is required'
      });
    }
    const res = await refreshTokenService(token);
    return response.status(200).json(res);
  } catch (error) {
    return response.status(400).json({
      message: error
    });
  }
};

// save post
export const savePost = async (request: Request, response: Response) => {
  try {
    const result = await userService.savePost(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// unsave post
export const unsavePost = async (request: Request, response: Response) => {
  try {
    const result = await userService.unsavePost(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};
